# loader
- 导出为函数的JS模块，最后通过module.exports输出
```JS
module.exports = function(source) {
  return source
}
```
- 多个Loader「串行执行」。
- 执行顺序从后到前。Compose
```JS
compose = (f,g) => (...args) => f(g(...args))
```

- run-loader。提供环境，调试loader效果。
- 传递参数。loader-utils
- 抛出错误。throw new Error(), this.callback