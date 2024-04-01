import { ComponentInstance, VNode } from "./type";
import { createComponentInstance, setupComponent } from "./component";

export function render(vnode: VNode, container: HTMLElement) {
  //     调用patch
  patch(vnode, container);
}

function patch(vnode: VNode, container: HTMLElement) {
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
function processComponent(vnode: VNode, container: HTMLElement) {
  mountComponent(vnode, container);
}

//挂载组件
function mountComponent(vnode: VNode, container: HTMLElement) {
  const instance: ComponentInstance = createComponentInstance(vnode);

  setupComponent(instance);
  setupRenderEffect(instance, vnode, container);
}

function setupRenderEffect(
  instance: ComponentInstance,
  vnode: VNode,
  container: HTMLElement
) {
  const subTree = instance.render.call(instance.proxy);

  patch(subTree, container); //开始递归patch

  //
  vnode.el = subTree.el;
}

// 处理 Element
function processElement(vnode: VNode, container: HTMLElement) {
  mountElement(vnode, container);
}

function mountElement(vnode: VNode, container: HTMLElement) {
  const el = (vnode.el = document.createElement(<string>vnode.type));

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
