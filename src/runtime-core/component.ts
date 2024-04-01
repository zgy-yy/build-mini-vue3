import { initProps } from "./componentProps";
import { ComponentInstance, KV, VNode } from "./type";

export function createComponentInstance(vnode: VNode): ComponentInstance {
  //创建组件实例
  //组件实例
  const componentInstance: ComponentInstance = {
    vnode,
    type: vnode.type,
  };
  return componentInstance;
}

export function setupComponent(instance: ComponentInstance) {
  //初始化组件
  //   TODO initProps
  initProps(instance, instance.vnode.props);

  // TODO initSlots
  setupStatefulComponent(instance); //处理有状态的组件，vue3中有无状态的函数式组件
}

function setupStatefulComponent(instance: ComponentInstance) {
  const component = instance.type; //组件对象
  instance.proxy = new Proxy(instance, {
    get(target, key) {
      const { setupState } = target;
      if (key === "props") {
        return instance.props;
      }

      if (key === "$el") {
        return instance.vnode.el;
      }
      if (key in setupState) {
        return setupState[key];
      }
    },
  });

  const { setup } = component;

  if (setup) {
    // setupResult 的返回值可以是function(render函数) 或者 Object
    const setupResult = setup(instance.props); //组件里定义的setup函数
    handleSetupResult(instance, setupResult);
  }
}

function handleSetupResult(instance: ComponentInstance, setupResult: any) {
  //     TODO function

  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }

  finishComponentSetup(instance);
}

function finishComponentSetup(instance: ComponentInstance) {
  const component = instance.type;
  if (component.render) {
    instance.render = component.render;
  }
}
