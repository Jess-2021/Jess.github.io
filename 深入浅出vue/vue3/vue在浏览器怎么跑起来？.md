# 从 createApp 开始 - 项目初始化渲染入口

![](/image/87c231e622f276fc30cc573f3c41955.png)

# createRenderer、baseCreateRenderer
- `createRenderer` 接受`DOM编辑`等相关方法，里面是通过调用 `baseCreateRenderer` 返回 `render, hydrate, createApp` 等相关方法；
```JS
export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>) {
  return baseCreateRenderer<HostNode, HostElement>(options)
}

// 很关键的一个函数
function baseCreateRenderer(){
  // 获取平台上的insert，remove函数...
  // vue 中更新、渲染组件的工具函数: patch, mount, unmount 等...

  // render 函数，判断容器有没有 `_vnode` 属性，如果有的话就执行 `unmount` 方法，没有的话就执行 `patch` 方法，最后把 vnode 信息存储在 `container._vnode` 上。
  const render: RootRenderFunction = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true)
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG)
    }
    flushPostFlushCbs()
    container._vnode = vnode
  }

  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  }
}
```

# createAppAPI

- 返回的 `createApp` 值是调用了 `createAppAPI` ，接受了`render`，和 `hydrate`。
- 创建一个 app 对象。app 上注册了 use、component 和 mount 等常见方法。
- 通过 `createVNode` 创建虚拟DOM，并通过 `render` 传递给 `patch` 或者 `unmount` 执行。
```JS

export function createAppAPI<HostElement>(
  render: RootRenderFunction,
  hydrate?: RootHydrateFunction
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent, rootProps = null) {
    const context = createAppContext()
    let isMounted = false
    const app: App = (context.app = {
      _context: context,
      _instance: null,
      use(plugin: Plugin, ...options: any[]) ,
      component(name: string, component?: Component): any {
        if (!component) {
          return context.components[name]
        }
        context.components[name] = component
        return app
      },
      directive,
      // mount 内部执行的是传递进来的 render 方法, rootContainer 就是我们 app.mount 中传递的 DOM 元素，对 DOM 元素进行处理之后，执行 patch 函数实现整个应用的加载。
      mount(
        rootContainer: HostElement,
        isHydrate?: boolean,
        isSVG?: boolean
      ): any {
        if (!isMounted) {
          const vnode = createVNode(
            rootComponent as ConcreteComponent,
            rootProps
          )
          vnode.appContext = context
          // 核心的逻辑
          if (isHydrate && hydrate) {
            hydrate(vnode as VNode<Node, Element>, rootContainer as any)
          } else {
            render(vnode, rootContainer, isSVG)
          }
          return getExposeProxy(vnode.component!) || vnode.component!.proxy
        }
      },
      provide(key, value) { ... }

    })

    return app
  }
}
```

# patch

## 做了什么
- `patch` 传递的是 `container._vnode`，也就是上一次渲染缓存的 `vnode`、本次渲染组件的 `vnode`，以及容器 `container`。
- 首先，将 n1 和 n2 做一次判断，如果虚拟DOM的节点类型不同，直接 unmount 之前的节点。
- 如果类型相同，则再去执行不同的函数，例如：`processText、processFragment、processElement 以及 processComponent` 等函数。

- App是一个组件，需要执行 processComponent ：如果首次渲染，n1 是null，所以执行mountComponent；更新时，n1 是上次的vDom，执行 updateComponent （即是diff的相关逻辑）。

# mountComponent
- 核心渲染逻辑： setupComponent 、setupRenderEffect。执行setup函数，之后将组件里的

## setupComponent
- setupComponent：执行 setup 函数。内部先初始化了 props 和 slots，并且执行 setupStatefulComponent 创建组件，而这个函数内部从 component 中获取 setup 属性。
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
## setupRenderEffect - 将 instance.update = effect.run

  - 递归整个虚拟 DOM 树，然后触发生命周期 `mounted`，完成这个组件的初始化（组件首次加载时，会调用`patch`）。
  - 之后，还注册了组件的更新机制。通过 `ReactiveEffect` 创建了 `effect` 函数。然后执行 `instance.update` 赋值为 `effect.run` 方法（ ref 和 reactive 绑定的数据，数据修改之后，就会触发 update 方法的执行）。
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