'use strict';

function createVNode(type, props, children) {
    return {
        type, //如果是组件 就是组件对象
        props,
        children,
        el: null
    };
}

function createComponentInstance(vnode) {
    //创建组件实例
    //组件实例
    const componentInstance = {
        vnode,
        type: vnode.type,
    };
    return componentInstance;
}
function setupComponent(instance) {
    //初始化组件
    // TODO initProps
    // TODO initSlots
    setupStatefulComponent(instance); //处理有状态的组件，vue3中有无状态的函数式组件
}
function setupStatefulComponent(instance) {
    const component = instance.type; //组件对象
    instance.proxy = new Proxy(instance, {
        get(target, key) {
            const { setupState } = target;
            if (key in setupState) {
                return setupState[key];
            }
            if (key === "$el") {
                return instance.vnode.el;
            }
        },
    });
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
    patch(vnode, container);
}
function patch(vnode, container) {
    //     如果是element
    if (typeof vnode.type == "string") {
        processElement(vnode, container);
    }
    //     如果是组件
    if (typeof vnode.type == "object") {
        processComponent(vnode, container);
    }
}
//处理组件
function processComponent(vnode, container) {
    mountComponent(vnode, container);
}
//挂载组件
function mountComponent(vnode, container) {
    const instance = createComponentInstance(vnode);
    setupComponent(instance);
    setupRenderEffect(instance, vnode, container);
}
function setupRenderEffect(instance, vnode, container) {
    const subTree = instance.render.call(instance.proxy);
    patch(subTree, container); //开始递归patch
    //
    vnode.el = subTree.el;
}
// 处理 Element
function processElement(vnode, container) {
    mountElement(vnode, container);
}
function mountElement(vnode, container) {
    const el = (vnode.el = document.createElement(vnode.type));
    if (vnode.props) {
        //处理属性
        for (const key in vnode.props) {
            el.setAttribute(key, vnode.props[key]);
        }
    }
    const { children } = vnode; //string array
    if (typeof children == "string") {
        el.textContent = children;
    }
    if (Array.isArray(vnode.children)) {
        // 如果 children 是数组，则遍历每一个子节点，并调用 patch 函数挂载它
        vnode.children.forEach((child) => {
            patch(child, el);
        });
    }
    container.append(el);
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            //     先转换成vnode
            const vnode = createVNode(rootComponent);
            render(vnode, rootContainer);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
