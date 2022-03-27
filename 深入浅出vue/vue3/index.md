# 解决核心问题 - DOM操作性能过差

## angular
- 脏检查，每次交互都检查一次数据是否变化，从而去更新DOM。

## vue1.x
- 响应式，初始化时，watcher监听数据的每个属性，数据变化时修改key去针对DOM变化。

## react
- 虚拟DOM，diff 检查后去更新。

## vue2.x - 组件级别的响应式
- 组件之间的变化通过响应式通知更新，内部数据变化则通过虚拟DOM来更新。

# JSX
- JSX 在vue中最终也是解析为`createVnode`执行，适合在动态性较高的情况下使用。
- 相比于 template 会缺少一些优化，template的限制比较多，但是 Vue 对其做了一部分优化。例如：
  - 静态属性的标记，直接越过 Diff 的过程；
  - @click 函数也做了一层cache 缓存。
  - 带冒号的属性是动态属性，因而存在使用一个数字去标记标签的动态情况。也是 Vue3 diff 比vue2 快的原因。

  ```JS
  import { toDisplayString as _toDisplayString, createElementVNode as _createElementVNode, openBlock as _openBlock, createElementBlock as _createElementBlock } from "vue"

  const _hoisted_1 = { id: "app" }
  const _hoisted_2 = /*#__PURE__*/_createElementVNode("h1", null, "技术摸鱼", -1 /* HOISTED */)
  const _hoisted_3 = ["id"]
  export function render(_ctx, _cache, $props, $setup, $data, $options) {
    return (_openBlock(), _createElementBlock("div", _hoisted_1, [
      _createElementVNode("div", {
        onClick: _cache[0] || (_cache[0] = ()=>_ctx.console.log(_ctx.xx)),
        name: "hello"
      }, _toDisplayString(_ctx.name), 1 /* TEXT */),
      _hoisted_2,
      _createElementVNode("p", {
        id: _ctx.name,
        class: "app"
      }, "极客时间", 8 /* PROPS */, _hoisted_3)
    ]))
  }
  ```

## vue 做了什么优化
- 性能：
  1. Vue3 相比于 Vue2 虚拟DOM 上增加 `patchFlag` 字段。按需更新。`只标记需要更新的元素或者属性`。
    ```JS
    const patchElement = (...) => {
      ...
      if (patchFlag > 0) {}
    }
    ```
  2. `hoistStatic 静态提升`。静态节点进行提升，第一次创建后，后续执行函数会复用这个创建方法。
  3. Fragments template和component 不必只有一个节点，会自动转成 `Fragments`.
  4. `事件缓存`。@click 函数也做了一层cache 缓存。`更新时引用不变即视为静态节点`。
    - vue2中每次更新，render函数跑完之后 vnode绑定的事件都是一个全新生成的function。Vue3中传入的事件会自动生成并缓存一个内联函数在cache里，变为一个静态节点。 - 享元模式
  5. diff 算法采用了`贪心和二分`，找到最短的操作路径。
  6. SSR 会讲一些静态标签，转化为文本。
    ```JS
    const msg = ref('Hello World!')
    const aa = computed(() => msg)

    // 动态绑定也是通过模板字符串添加进去
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<!--[--><h1>${_ssrInterpolate(_unref(aa))}</h1><input><!--]-->`)
    }
    
    __sfc__.__file = "App.vue"
    export default __sfc__
    ```
- 包体积：
  1. `tree shaking`。
    - new Vue时的，vue2无法对其进行tree-shaking
      ```js
      // vue2 对象形式
      const app = new Vue({
        router,
        store
        render: h => h(App)
      })
      app.$mount('#app')

      // vue3
      createApp(App).use(router).use(store).mount('#app')

      // 在webpack做tree-shaking时，无法处理动态语言对象上的属性的，而且也无法对这些属性进行优化，比如通过uglify来缩短属性名称
      ```
    - API。之前全局api都暴露在vue实例上，未被使用也无法被tree shaking。vue3将其api作为ES模块构建导出，从而可以被tree shaking。
  ![](/image/237ce858e266324cd60c0ee4c67c753.png)
- 健壮性：
  - 抛离之前的this（类型混乱，扩展困难），更全面的ts类型系统支持。
  - composition，编写函数一样自由，组合和重用有状态的组件逻辑；
## 响应式原理对比
- vue2无法监听对象或数组新增、删除的元素。
  - 通过拦截数组方法；
  - Vue.set 监听对象数组新增属性，new 个新对象，然后将修改过后的对象深拷贝给新对象
- Vue3
  - 能拦截对象的行为；但对象的新增和删除，.length的修改，Map、set、weakMap、weakSet的支持解决不了。
