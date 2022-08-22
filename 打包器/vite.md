## 依赖预构建

  - 将所有的代码视为原生ES模块。包括 `CJS或者UMD`。
  - 将内部的依赖关系通过 `ESbuild` 无敌的构建速度转换为单个模块。同时并`合并请求`, 并指向 `node_module` 里的包；

# 特点：
- 项目完全由 esModule 组成。
- 打包还是用 rollup 等传统打包。
- 构建优化:
  - CSS代码分割。会将异步模块里的CSS抽离成一个单独的文件。会在chunk加载完成时通过`link`引入，该chunk会在css加载完成后执行。
  - 预加载指令生成。`module preload`
  - 递归解析依赖，以减少「网络往返」

# 插件机制
- vite 将插件机制做成兼容 Rollup 的格式。对外提供一些时机的钩子或者工具方法，让用户去配置代码，达到介入 rollup 运行过程中；
- 只要一个 Rollup 插件符合以下标准，那么它应该只是作为一个 Vite 插件：
  - 没有使用 moduleParsed 钩子
  - 在打包钩子和输出钩子之间没有很强的耦合
  - 如果一个 Rollup 插件只在构建阶段有意义

# 原理

## 构建原理
- 浏览器ESM + ESbuild
- 请求拦截。
  - 依赖解析。解决第三方库引入问题。需要协商好link。例如：
    ```JS
    import vue from "/@modules/vue"
    ```
    - 然后再进行 replace，映射到项目本身的 node_module 位置，找到引入包package中的main位置。之后再创建一个script标签（type='module'），然后将其插入到head中。
  - 依赖预构建。
    - CJS,UMD => ESM
    - 合并请求，将有许多内部模块的 ESM 依赖关系转换为单个模块。
  - 静态资源加载。静态资源将 `处理成ESM模块` 返回。
  - vue文件缓存。.vue 模板文件的特殊性，它被拆分成 template, css, script 模块三个模块进行分别处理。最后会对 script, template, css 发送多个请求获取

## 热更新：
- 客户端与服务端建立了一个 websocket 连接，当代码被修改时，服务端发送消息通知客户端去请求修改模块的代码，完成热更新。


# 缺点：
- Vite 还是使用的 es module 模块不能直接使用生产环境 => 客户端浏览器需要一个比较新的版本。(官方提供了`uild.polyfillDynamicImport 配置项配合 @vitejs/plugin-legacy`打包出一个看起来兼容性比较好的版本。)
- 用rollup打包会造成开发和生产环境不一致。
- 第三方 sdk 没有产出 ems 格式的的代码，这个需要自己去做一些兼容。
