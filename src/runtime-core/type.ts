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
}
