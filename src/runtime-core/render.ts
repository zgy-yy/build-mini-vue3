import {createComponentInstance, setupComponent} from "./component";

export function render(vnode, container) {
//     调用patch
    patch(vnode, container)
}


function patch(vnode, container) {
//     如果是element
//     processElement()
    console.log(vnode.type)
//     如果是组件
    processComponent(vnode, container)

}


function processComponent(vnode, container) { //处理组件
    mountComponent(vnode, container)
}

function mountComponent(vnode, container) { //挂载组件
    const instance = createComponentInstance(vnode)

    setupComponent(instance)
    setupRenderEffect(instance, container)
}

function setupRenderEffect(instance, container) {
    const sbuTree = instance.render()

    patch(sbuTree, container) //开始递归patch
}