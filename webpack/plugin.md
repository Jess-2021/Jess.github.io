# plugin

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