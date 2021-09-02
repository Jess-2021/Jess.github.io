# plugin
- 修改输出内容，输出文件，提升webpack性能。
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
## compiler 和 compilation
- 特征：
  - compiler包含了webpack环境所有的配置信息，包含了options，loaders，plugins等。会在webpack启动时被实例化。
  - compilation。包含了当前的模块资源，编译生成的文件，变化的文件等。每当一个文件变化时，一次新的Compilation会被创建，也提供了很多事件回调做扩展。
- 区别：
  - compiler代表整个webpack从启动到关闭的生命周期，而compilation代表一次新的编译。