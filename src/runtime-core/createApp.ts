import { VNode } from "./type";
import { createVNode } from "./vnode";
import { render } from "./render";


export function createApp(rootComponent:VNode) {
  return {
    mount(rootContainer:HTMLElement) {
      //     先转换成vnode
      const vnode = createVNode(rootComponent);

      render(vnode, rootContainer);
      
    },
  };
}
