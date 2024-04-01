import { KV, VNode } from "./type";
import { createVNode } from "./vnode";

export function h(type: VNode, props?: KV, children?: VNode[]) {
  return createVNode(type, props, children);
}
