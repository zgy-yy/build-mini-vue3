export function createComponentInstance(vnode) { //创建组件实例
    const componentInstance = { //组件实例
        vnode,
        type: vnode.type
    }

    return componentInstance
}

export function setupComponent(instance) { //初始化组件
    // TODO initProps
    // TODO initSlots

    setupStatefulComponent(instance);//处理有状态的组件，vue3中有无状态的函数式组件
}


function setupStatefulComponent(instance) {
    const component = instance.type

    const {setup} = component

    if (setup) {
        // setupResult 的返回值可以是function(render函数) 或者 Object
        const setupResult = setup() //组件里定义的setup函数
        handleSetupResult(instance, setupResult)
    }
}

function handleSetupResult(instance, setupResult: any) {

//     TODO function

    if (typeof setupResult === "object") {
        instance.setupState = setupResult
    }

    finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
    const component = instance.type
    if (component.render) {
        instance.render = component.render
    }
}