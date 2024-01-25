export function createVNode(type, props?, children?) {
    return {
        type,//如果是组件 就是组件对象
        props,
        children
    }
}