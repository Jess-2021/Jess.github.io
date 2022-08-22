# 构建速度分析 - speed-measure-webpack-plugin
- 整个打包的总耗时
- 每个插件和loader的耗时

# 体积分析 - webpack-bundle-analyzer
- 分析依赖的第三方组件大小
- 业务组件里的组件代码大小

- PS：babel-polyfill

# 使用高版本的node和webpack

# 多进程，多实例构建
资源并行 `解析` - `thead-loader`
- 每次 webpack 解析一个模块，`thead-loader` 会将他的依赖分配给多个 worker 线程中执行。

# 多进程，多实例构建
资源并行 `压缩` - `terser-webpack-plugin`
- `terser-webpack-plugin` 并行压缩。（支持ES6压缩）
```js
optimization: {
  minimizer: {
    new TerserPlugin({
      paraller: 4 // cpu核心
    })
  }
}
```

# dll分包

## 对比 externals
- 优点：`externals` 会将包分割成多个工具包，`对基础库进行分离`；
- 缺点：
  - 需要各自指定 `CDN`，可能会产生多个 `script` 标签。
  - `splitChunk`，还会对基础库里面的代码进行分析。

## 进一步分包 - 预编译资源模块
- 原理：将多个基础库包装成一个包；不分析里面基础库的代码。
- 操作：
  - 在 `externals` ，或者 `splitChunks` 之上进一步进行分包，将多个基础库通过 `dllPlugin` 打成一个包。
  - 通过 `dllPlugin` 提取多个组件里的包，生成包同时，也会生成一个`manifest.json`文件。可以通过 `dllReferencePlugin` 通过映射到相应的依赖上。

# 缓存 - 提升解析速度
- `babel-loader`。JS转化缓存。
- `terser-webpack-plugin`。代码压缩缓存，
- `cache-loader`。模块解析缓存。
```js
// babel-loader
use: {
  loader: 'babel-loader',
  options: {
    cacheDirectory: true // 开启babel-loader缓存
  }
}

```

# 缩小构建目标
- 减少文件搜索范围
  - 优化 `resolve.modules`，减少模块搜索层级。
  - 优化 `resolve.mainFields`，入口文件
  - 优化 `resolve.extension`，文件扩展名，webpack先找js，再找json
  - 合理应用 `alias`。
- `babel-loader`。不解析node_module

# 资源体积压缩

##  图片压缩
- `image-webpack-plugin`。「imagemin」
- `PNG`压缩原理：
  - pngquant。将图像转化为具有 `alpha通道` 的更高效的8位png格式（比24/32位小60~80%）。
  - pngcrush。不同`压缩级别`，降低png IDAT数据流大小，压缩级别越多，体积越小
  - optipng。类似`pngcrush`。只是在pngcrush基础上再多几次压缩。
  - tinypng。24位转8位，非必要的metadata会被剥离。

## tree shaking css
- 如果模块一个函数被引用了，就把所有的方法都引入。
- `purgecss-webpack-plugin`，需要配合 `mini-css-extract-plugin` 等能提取css的插件一起使用。遍历代码。识别用到的 css ，没有就标记。
- `uncss`。需要HTML通过jsdom加载，其次样式需要通过`PostCSS`加载。然后通过`document.querySelector`识别文件里不存在的选择器。

## 动态polyfill
- babel-polyfill。包体积200+KB
- `polyfill-service`。通过UA拿到引擎,请求接口动态下发polyfill。

![](/image/webpack.png)