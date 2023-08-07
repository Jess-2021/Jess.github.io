# plugin vs module

## 内容
- Nuxt.js 模块通常是 Nuxt.js 插件的包装器。
```js
import Vue from 'vue'

const myVuePlugin = {
  install(Vue, options) {
    Vue.prototype.$hello = 'world'
    inject('hello', 'world') // inject 可以根据 nuxt 配置和环境决定将属性添加到vue 或者 context 
  },
}

Vue.use(myVuePlugin)
```
- Nuxt.js 插件通常是 Vue 插件的包装器。

## 执行时机
- nuxt 首先加载并执行 `module` ，然后创建 `Vue instance` 和 `Nuxt context`，然后执行 `Nuxt` 插件。