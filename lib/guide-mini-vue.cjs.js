'use strict';

function createVNode(type, props, children) {
    return {
        type, //如果是组件 就是组件对象
        props,
        children
    };
}

function createComponentInstance(vnode) {
    const componentInstance = {
        vnode,
        type: vnode.type
    };
    return componentInstance;
}
function setupComponent(instance) {
    // TODO initProps
    // TODO initSlots
    setupStatefulComponent(instance); //处理有状态的组件，vue3中有无状态的函数式组件
}
function setupStatefulComponent(instance) {
    const component = instance.type;
    const { setup } = component;
    if (setup) {
        // setupResult 的返回值可以是function(render函数) 或者 Object
        const setupResult = setup(); //组件里定义的setup函数
        handleSetupResult(instance, setupResult);
    }
}
function handleSetupResult(instance, setupResult) {
    //     TODO function
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    const component = instance.type;
    if (component.render) {
        instance.render = component.render;
    }
}

function render(vnode, container) {
    //     调用patch
    patch(vnode);
}
function patch(vnode, container) {
    //     如果是element
    //     processElement()
    console.log(vnode.type);
    //     如果是组件
    processComponent(vnode);
}
function processComponent(vnode, container) {
    mountComponent(vnode);
}
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance);
}
function setupRenderEffect(instance, container) {
    const sbuTree = instance.render();
    patch(sbuTree); //开始递归patch
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            //     先转换成vnode
            const vnode = createVNode(rootComponent);
            render(vnode);
        }
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
