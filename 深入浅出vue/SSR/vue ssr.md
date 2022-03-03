## vue ssr - require('@vue/server-renderer').renderToString
- CSR下，template 解析的 render 函数用来返回组件的虚拟 DOM；SSR 环境下 template 解析的 ssrRender 函数，函数内部是`通过 _push 对字符串进行拼接`。
```JS
function ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _cssVars = { style: { color: _ctx.color }}
  _push(`<div${_ssrRenderAttrs(_mergeProps(_attrs, _cssVars))}><ul><!--[-->`)
  _ssrRenderList(_ctx.todos, (todo, n) => {
    // _push 对字符串进行拼接
    _push(`<li>${
      _ssrInterpolate(n+1)
    }--${
      _ssrInterpolate(todo)
    }</li>`)
  })
  _push(`<!--]--></ul></div>`)
}
```

## renderToString
```js
export async function renderToString(
  input: App | VNode,
  context: SSRContext = {}
): Promise<string> {
  if (isVNode(input)) {
    // raw vnode, wrap with app (for context)
    return renderToString(createApp({ render: () => input }), context)
  }
  const vnode = createVNode(input._component, input._props)

  ...
  // 对创建的 Vnode 进行渲染，生成一个 buffer 变量
  const buffer = await renderComponentVNode(vnode)
  // unrollBuffer 返回字符串
  return unrollBuffer(buffer as SSRBuffer)
}
```

## renderComponentVNode
```Js
export function renderComponentVNode(
  vnode: VNode,
  parentComponent: ComponentInternalInstance | null = null,
  slotScopeId?: string
): SSRBuffer | Promise<SSRBuffer> {
  const instance = createComponentInstance(vnode, parentComponent, null)

  if (hasAsyncSetup || prefetches) {
    ....
    // 进行虚拟 DOM 的子树渲染
    return p.then(() => renderComponentSubTree(instance, slotScopeId))
  } else {
    return renderComponentSubTree(instance, slotScopeId)
  }
}
```
## renderComponentSubTree
```JS
function renderComponentSubTree(instance,slotScopeId) {
  const { getBuffer, push } = createBuffer()

  // renderComponentSubTree 内部调用组件内部的 ssrRender 函数
  if (ssrRender) {
    ssrRender(...) {

    }
}
```

## createBuffer
```JS
export function createBuffer() {
  let appendable = false
  const buffer: SSRBuffer = []
  return {
    getBuffer(): SSRBuffer{},
    push(item: SSRBufferItem) {
      // push 函数就是不停地在数组最后新增数据，如果 item 是字符串，就在数组最后一个数据上直接拼接字符串，否则就在数组尾部新增一个元素（提前合并字符串，小优化）
      const isStringItem = isString(item)
      if (appendable && isStringItem) {
        buffer[buffer.length - 1] += item as string
      } else {
        buffer.push(item)
      }
      appendable = isStringItem
      // 数组中可能会有异步的组件
      if (isPromise(item) || (isArray(item) && item.hasAsync)) {
        // promise, or child buffer with async, mark as async.
        // this allows skipping unnecessary await ticks during unroll stage
        buffer.hasAsync = true
      }
    }
  }
}
```

## unrollBuffer
```JS
async function unrollBuffer(buffer: SSRBuffer): Promise<string> {
  if (buffer.hasAsync) {
    for (let i = 0; i < buffer.length; i++) {
      let ret = ''
      let item = buffer[i]
      if (isPromise(item)) {
        // 可能存在异步组件，故需要 await，等待执行完毕后，进行字符串的拼接，最后返回给浏览器。
        item = await item
      }
      if (isString(item)) {
        ret += item
      } else {
        ret += await unrollBuffer(item)
      }
    }
  } else {
    return unrollBufferSync(buffer)
  }
}
```