let activeEffect: ReactiveEffect = null //当前正在收集的副作用函数

const effectStack: ReactiveEffect[] = [] //用于处理嵌套的effect

type Options = {
    lazy?: boolean, scheduler?: (fn: Function) => void
}
class ReactiveEffect {
    //
    private _fn: Function; //副作用函数
    deps: Set<ReactiveEffect>[] = [] //该副作用函数都被哪些依赖集合所收集

    constructor(fn: Function, public options?: Options) {
        this._fn = fn
    }

    run() {
        cleanup(this)//在执行 副作用函数时清除收集本副作用函数的依赖集合，先断开副作用函数与响应式数据之间的依赖，因为在执行本副作用函数后又会被重新收集，防止不必要的更新
        activeEffect = this
        effectStack.push(this)
        // 执行 fn时，会触发 proxy的get 进行依赖收集
        let res = this._fn()
        effectStack.pop()
        activeEffect = effectStack[effectStack.length - 1]
        return res
    }
}

export function effect(fn: Function, options?: Options) {
    const _effect = new ReactiveEffect(fn, options)

    if (!options || !options.lazy) {
        _effect.run();//执行真正的副作用函数触发依赖收集
    }
    return _effect.run.bind(_effect) //返回副作用函数
}


function cleanup(effectFn: ReactiveEffect) {
    for (let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i]
        deps.delete(effectFn) //将副作用函数从依赖集合里删除
    }
    effectFn.deps.length = 0 //重置 effectFn.deps 数组
}

const bucket = new WeakMap<Object, Map<Object, Set<ReactiveEffect>>>()

/*
* 收集依赖
* */
export function track(target: Object, key: string | Symbol) {
    if (!activeEffect) //没有
        return
    // target -> key ->deps
    let depsMap = bucket.get(target);
    if (!depsMap) {
        depsMap = new Map<Object, Set<ReactiveEffect>>()
        bucket.set(target, depsMap)
    }
    let effects: Set<ReactiveEffect> = depsMap.get(key)
    if (!effects) {
        effects = new Set()
        depsMap.set(key, effects)
    }
    effects.add(activeEffect)
    activeEffect.deps.push(effects) //保存当前的副作用函数被 收集的集合（set）

}

export function trigger(target: Object, key: string | Symbol) {
    let depsMap = bucket.get(target)
    if (!depsMap)
        return
    const effects = depsMap.get(key)
    const effectsToRun = new Set<ReactiveEffect>()//防止cleanup引起的无限循环
    // 如果trigger触发执行的副作用函数与正在执行的相同，则不触发，避免 obj.foo=obj.foo+1 这样引起的无限循环
    effects && effects.forEach(effectFn => {
        if (effectFn !== activeEffect) {
            effectsToRun.add(effectFn)
        }
    })
    effectsToRun.forEach(effect => {
        if (effect?.options?.scheduler) {
            effect.options.scheduler(effect.run.bind(effect))
        } else {
            effect.run()
        }
    })
}

