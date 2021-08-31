# webpack构建优化

## 初步分析 - stats 初略的看打包出来的效果

## 构建速度分析 - speed-measure-webpack-plugin
- 整个打包的总耗时
- 每个插件和loader的耗时

## 体积分析 - webpack-bundle-analyzer
- 分析依赖的第三方组件大小
- 业务组件里的组件代码大小

- PS：babel-polyfill

## 多进程，多实例构建：资源并行解析
- 每次webpack解析一个模块，thead-loader会将他的依赖分配给多个worker线程中执行。

## 多进程，多实例构建：资源并行压缩
- parallel-ugify-plugin,terser-webpack-plugin并行压缩。
## dll分包
- 将多个基础库包装成一个包，减少每个文件的大小。不分析里面基础库的代码，直接抽离出来成一起的一个包。
- 在externals，或者splitChunks之上进一步进行分包，将多个基础库通过dllPlugin打成一个包。
- 通过dllPlugin分包，同时在输出HTML文件时，通过dllReferencePlugin引用manifest类似输出文件。

## 缓存 - 提升解析速度
- babel-loader。JS转化缓存。
- uglify js。（terser-webpack-plugin）
- 模块解析缓存。（cache-loader）

## 缩小构建目标
- 减少文件搜索范围
  - 优化resolve.modules，减少模块搜索层级。
  - 优化resolve.mainFields，入口文件
  - 优化resolve.extension，文件扩展名，webpack先找js，再找json
  - 合理应用alias。
- babel-loader。不解析node_module

## 资源体积压缩

###  图片压缩
- image-webpack-plugin。「imagemin」
- 压缩原理：
  - pngquant。将图像转化为具有alpha通道的更高效的8位png格式（比24/32位小60~80%）。
  - pngcrush。不同压缩级别，降低png IDAT数据流大小，压缩级别越多，体积越小
  - optipng。重新压缩
  - tinypng。24位转8位，非必要的metadata会被剥离。

### tree shaking css
- 如果模块一个函数被引用了，就把所有的方法都引入。
- purifyCSS，遍历代码。识别用到的css，没有就标记。
- uncss。jsdom加载。

### 动态polyfill
- babel-polyfill。
- polyfill-service。通过UA拿到引擎，动态下发polyfill。