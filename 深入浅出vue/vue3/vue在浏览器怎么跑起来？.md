# 从 createApp 开始
项目初始化渲染入口

![](/image/87c231e622f276fc30cc573f3c41955.png)

# createRenderer、baseCreateRenderer

- `createRenderer` 接受 `DOM编辑` 等相关方法，里面是通过调用 `baseCreateRenderer` 返回 `render, hydrate, createApp` 等相关方法；
```JS
export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement
>(options: RendererOptions<HostNode, HostElement>) {
  return baseCreateRenderer<HostNode, HostElement>(options)
}

// 很关键的一个函数
function baseCreateRenderer(){
  // 获取平台上的 insert，remove 函数...
  // vue 中更新、渲染组件的工具函数: patch, mount, unmount 等...

  // render 函数，判断容器有没有 `_vnode` 属性，如果有的话就执行 `unmount` 方法，没有的话就执行 `patch` 方法，最后把 vnode 信息存储在 `container._vnode` 上。
  const render: RootRenderFunction = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true)
      }
    } else {
      // 包含首次渲染，二次渲染
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