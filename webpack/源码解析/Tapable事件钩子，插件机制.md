# webpack - Compiler
- webpack是基于事件流「发布订阅」的编程范式，一系列插件通过hooks的方式进行运行。

## Tapable插件架构和hooks
-  compiler，继承于Tapable的一系列钩子特性，来定义自己的钩子。
- 然后，plugin，loader通过监听相应的compiler或者compilation来执行相应的逻辑。

## 钩子种类
- syncHook。同步钩子，同步方法。
- bail。熔断钩子。当函数有任何返回值，就会在当前执行函数停止。
- waterfail。同步流水。同步方法，并且会将值传送给下一个函数。
- loop。循环。监听函数返回true继续循环，返回undefined结束循环。
- parallel。异步并发。异步并行执行钩子。
- series。串行。异步串行钩子

## 钩子模型
```JS
// 注册钩子
hooks.tap('hookName', (params) => callback)

// 调用回调函数传入参数
hooks.hookName.call(params)
```
- compiler的钩子是通过tap或者tapPromise进行调用

# Compiler与插件机制

## webpack上的插件注册,插件执行
- plugin会有一个「apply」方法，并接收一个「compiler实例」参数。
- plugin通过「监听」compiler上的时间钩子，然后做一些操作。
```JS
if (Array.isArray(options)) {
  compiler = new MultiCompiler(options.map(option => webpack(option)))
} else if (typeof options === 'object') {
  options = new WebpackOptionsDefaulter().process(options) // webpack 初始化
  compiler = new Compiler(option.content)
  compiler.options = options // cli或者配置传入的配置
  new NodeEnvironmentPlugin().apply(compiler)  // plugin.apply(compiler)
  if (options.plugins && Array.isArray(options.plugins)) {
    for(const plugin of option.plugins) { // 遍历注册plugin，并注入compiler方法
      if (typeof plugin === 'function') {
        plugin.call(compiler, compiler)
      } else {
        plugin.apply(compiler)
      }
    }
    
    compiler.run()
  }

  compiler.hooks.environment.call()
  compiler.hooks.afterEnvironment.call()
  compiler.options = new WebpackOptionsApply().process(options, compiler) // webpack 内部插件注入
}
```

## Compiler模拟
- 实例化后会调用run方法进行构建过程
```JS
module.exports = class Compiler {
  constructor() {
    this.hooks = {
      // ···
      brake: new SyncHook(),
      waitRoutes: new AsyncSeriesHook(['source', 'target'])
    }
  }

  run() { // run函数会在实例化compiler时被调用
    // 调用某些hook
  }

  break() {
    this.hooks.brake.call() // 同步通过call执行
  }
  waitRoutes() {
    this.hooks.waitRoutes.promise(...arguments).then(() => {}, err => {}) // 异步通过promise执行
  }
}
```

## plugin模拟
```JS
const Compiler = require('./Compiler')

class MyPlugin {
  constructor() {}

  apply(compiler) { // 接受compiler方法
    compiler.hooks.brake.tap('pluginHook,Name', callback) // 监听了break hook
    compiler.hooks.waitRoutes.tapPromise)()
  }
}
```
