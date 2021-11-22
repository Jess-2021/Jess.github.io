# loader
- 导出为函数的JS模块，最后通过module.exports输出。
- 用于对非JS模块的转化，并且在build中引入依赖。将其转化为JS模块或者data URL。

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

## 工作流程
- 遇到相应的模块文件时，会触发loader。
- 接受一个表示模块文件内容的source。
- 使用一系列的api对source进行转换，得到一个result。
- 将result传递给下一个loader，知道处理完毕。

# 常用loader

## babel-loader
- 模块解析，`cacheDirectory`开启babel缓存。

## image-webpack-loader
- 在选项中选中哪个图片处理库，将他们require，并处理，图片压缩。
  -`pngquant`或者`tinypng`，将24/32位文件转化为8位png。
  - `optipng`，调高压缩级别。调整图片尺寸。