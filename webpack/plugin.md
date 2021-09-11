# plugin

- 修改输出内容，输出文件，提升webpack性能。包括打包出的内容的优化，压缩。
- 是一个class。并且有apply方法，接受一个compiler实例。监听webpack上的hook。
- 编写插件的插件，插件自身可以暴露自身进行自身扩展。可以通过调用插件的Hook进行插件功能注入。
- 写入compilation的assets时用webpack-resource。
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
## 1. extract-text-webpack-plugin
- webpack默认会把css当作模块提取到一个chunk中，extract-text-webpack-plugin就是将css提取成独立的css文件。

## 2. html-webpack-plugin
- 创建HTML将输出的chunk打包结果输出到该HTML。

## 3. UglifyJsPlugin JS压缩

## 4. CommonsChunkPlugin
- 提取第三方库和公用模块，常用于多页面应用，生成共有的chunk。