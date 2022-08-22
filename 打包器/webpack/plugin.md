# plugin

- 修改输出内容，输出文件，提升webpack性能。包括打包出的内容的优化，压缩。
- 是一个class。并且有apply方法，接受一个 `compiler` 实例。监听 `webpack` 上的 `hook` 。
- 编写插件的插件，插件自身可以暴露自身进行自身扩展。可以通过调用插件的 `Hook` 进行插件功能注入。
- 写入 `compilation` 的 `assets` 时用 `webpack-resource` 。
```JS
export default class MyPlugin {
  constructor(option) {
    this.options = option
  }
  apply(compiler) {
    compiler.hooks.done.tap('my plugin', {
      stats
    } => {
      // do something
    })
  }
}
```

# 常用plugin
## extract-text-webpack-plugin
- webpack默认会把css当作模块提取到一个chunk中，`extract-text-webpack-plugin`就是将css提取成独立的css文件。

## html-webpack-plugin
- 创建HTML将输出的chunk打包结果输出到该HTML。

## UglifyJsPlugin JS压缩

## CommonsChunkPlugin
- 提取第三方库和公用模块，常用于多页面应用，生成共有的chunk。

## HtmlWebpackExternalsPlugin - CDN外链包
- 配合`external`排除不需要被收集依赖的模块，在用plugin`注入CDN。

## DllPlugin， DllReferencePlugin - 分包
- 进一步分包「预编译资源模块」。对框架库进行提取，打成一个包，可以通过`manifest.json` 自动关联到需要的包

## terser-webpack-plugin（JS）
- 多进程并行压缩JS，同时可以进行`缓存`。

## purifyCSS - css tree shaking
- 对css进行 `tree Shaking`。(windi没有相关问题)

## thread-loader - 多线程
- webpack 4 官方多进程打包loader。通过创建一个线程池对模块解析进行分配，最后将处理好的模块传递给到webpack。
