import { KV, VNode } from "./type";

export function createVNode(
  type: string | Object,
  props?: KV,
  children?: VNode[]
): VNode {
  return {
    type, //如果是组件 就是组件对象
    props,
    children,
    el:null
  };
}
