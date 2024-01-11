let activeEffect: ReactiveEffect = null //当前正在收集的副作用函数
class ReactiveEffect {
    //
    private _fn: Function; //副作用函数
    deps: Set<ReactiveEffect>[] = [] //该副作用函数都被哪些依赖集合所收集

    constructor(fn: Function) {
        this._fn = fn
    }

    run() {
        cleanup(this)//在执行 副作用函数时清除收集本副作用函数的依赖集合，先断开副作用函数与响应式数据之间的依赖，因为在执行本副作用函数后又会被重新收集，防止不必要的更新
        activeEffect = this
        // 执行 fn时，会触发 proxy的get 进行依赖收集
        return this._fn()
    }
}

function cleanup(effectFn: ReactiveEffect) {
    for (let i = 0; i < effectFn.deps.length; i++) {
        const deps = effectFn.deps[i]
        deps.delete(effectFn) //将副作用函数从依赖集合里删除
    }
    effectFn.deps.length = 0 //重置 effectFn.deps 数组
}

const bucket = new WeakMap()
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
    let deps: Set<ReactiveEffect> = depsMap.get(key)
    if (!deps) {
        deps = new Set()
        depsMap.set(key, deps)
    }
    deps.add(activeEffect)
    activeEffect.deps.push(deps) //保存当前的副作用函数被 收集的集合（set）

}

export function trigger(target: Object, key: string | Symbol) {
    let depsMap = bucket.get(target)
    if (!depsMap)
        return
    const deps = depsMap.get(key)
    // console.log(dep)
    const effectsToRun = new Set<ReactiveEffect>(deps)//防止无限循环
    effectsToRun.forEach(effect => effect.run())
}

export function effect(fn: Function) {
    const _effect = new ReactiveEffect(fn)
    _effect.run();//执行真正的副作用函数触发依赖收集
    return _effect.run.bind(_effect)
}

