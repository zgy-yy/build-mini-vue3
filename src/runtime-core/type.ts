// interface

export type KV = { [key: string | symbol]: any };

export interface VNode {
  type: string | KV;
  props: KV;
  children: VNode[];
  el?: HTMLElement;
}

export interface ComponentInstance {
  vnode: VNode;
  type: VNode["type"];
  setupState?: KV;
  render?: Function;
  proxy?: KV;
  props: KV;
}

export enum ShapeFlags {
  element = 1,
  stateful_component = 1 << 1,
  text_children = 1 << 2,
  array_children = 1 << 3,
}
