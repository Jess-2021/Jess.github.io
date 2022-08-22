# patch

## 做了什么
- `patch` 传递的是 `container._vnode`，也就是上一次渲染缓存的 `vnode`、本次渲染组件的 `vnode`，以及容器 `container`。
- 首先，将 n1 和 n2 做一次判断，如果虚拟DOM的节点类型不同，直接 unmount 之前的节点。
- 如果类型相同，则再去执行不同的函数，例如：`processText、processFragment、processElement 以及 processComponent` 等函数。

- App 是一个组件，需要执行 `processComponent` ：如果首次渲染，n1 是null，所以执行 `mountComponent` ；更新时，n1 是上次的 `vDom` ，执行 `updateComponent` （即是diff的相关逻辑）。

# mountComponent
核心渲染逻辑： `setupComponent` 、`setupRenderEffect` 。执行 `setup` 函数，之后将组件里的

## setupComponent

- setupComponent：执行 `setup` 函数。内部先 `初始化了 props 和 slots` ，并且执行 `setupStatefulComponent` 创建组件，而这个函数内部从 component 中获取 setup 属性。

```JS
export function setupComponent(
  instance: ComponentInternalInstance,
  isSSR = false
) {
  const { props, children } = instance.vnode
  const isStateful = isStatefulComponent(instance)
  initProps(instance, props, isStateful, isSSR)
  initSlots(instance, children)

  const setupResult = isStateful
      ? setupStatefulComponent(instance, isSSR)
      : undefined
  // something about SSR...
  return setupResult
}

function setupStatefulComponent(
  instance: ComponentInternalInstance,
  isSSR: boolean
) {
  const Component = instance.type as ComponentOptions
  // 执行setup
  const { setup } = Component
  // ...
}
```
## setupRenderEffect
将 `instance.update = effect.run`

  - 递归整个虚拟 DOM 树，然后触发生命周期 `mounted`，完成这个组件的初始化（组件首次加载时，会调用 `patch`）。
  - 之后，还注册了组件的更新机制。通过 `ReactiveEffect` 创建了 `effect` 函数。然后执行 `instance.update` 赋值为 `effect.run` 方法（ `ref` 和 `reactive` 绑定的数据，数据修改之后，就会触发 update 方法的执行）。
  ```JS
  // updateComponent...

  // 内部就会 `componentUpdateFn`，内部进行递归的 patch 调用执行每个组件内部的 update 方法实现组件的更新。
  const effect = new ReactiveEffect(
    componentUpdateFn,
    () => queueJob(instance.update),
    instance.scope // track it in component's effect scope
  )
  const update = (instance.update = effect.run.bind(effect) as SchedulerJob)
  update.id = instance.uid
  update()
  ```