# 体积优化

## 代码压缩
- css压缩：`OptimizeCssAssetsWebpackPlugin` 去除css空格。

- JS压缩：
  - `uglify`. 缺点：不支持ES6
  - `terser`. webpack内置，同时对于es6有更好的支持，底层还是基于 `uglify`。
  - swc

## 移除不必要的模块
- tree shaking.
  - 条件：
    - （es5 模块语法）
    - mode 为 production
  - /*#__PURE__*/ 作用于语句层面。帮助terser标记一个语句有没有副作用。
  - sideEffects。作用于代码层面。如果被标记为无副作用的模块没有被直接导出使用，打包工具会跳过进行模块的副作用分析评估。

- 选择体积更小的模块

- 按需引入。
  ```JS
  import get from 'lodash.get'
  import { get } from 'lodash'
  ```

## 按需加载

## code splitting - 切割大的chunk，利用HTTP的并行请求
- 对于，图表，不可见屏幕下方的组件，其他页面均可暂缓加载；
- 操作：
  - `import('/a')` 动态加载模块
  - `React.lazy` 动态加载组件
  - `lodable-component` 动态加载路由，组件或模块

- 原理：
  - ...

## bundle splitting - 分包缓存
- 可根据 develop tool coverage 查看chunk的使用情况。
- 分层缓存打包。
  - 最低频率更新的库，例如：vue；
  - 常用第三方库，例如：lodash => vendor
  - 业务代码公用代码。

# Nginx

## 开启Gzip压缩 - 针对js，css，html静态文件
- Nginx会根据配置的策略对发送的内容，例如：js，html，css进行压缩，大部分的浏览器都支持Gzip。一般会对资源大小变为原来的`30%`甚至更小。
- 会耗费一定的cpu计算。
- 图片例如JPG，png本身就有压缩，压缩前后没有多大区别。
```nginx
http {
  ...

  gizp on;
  gzip-min-length 1k; # 允许压缩的页面最小字节(header `Content-Length`)
  gzip_buffers 4 16k; # 申请的内存大小
  gzip_http_version 1.1 # 识别的HTTP版本
  gzip_comp_level 2; # 设置gzip压缩等级，会消耗cpu性能
  gzip_types text/plain application/x-javascript text/css application/xml; # 需要压缩的MIME类型
  gzip_vary on
}
```

## 缓存
- 协商缓存
  ```nginx
  server {
    location ~ /node/(\d*) {
      add_header Cache-Control no-cache;
      root ...
    }
  }
  ```


# 图片懒加载

## getBoundingClientRect + window.scroll + throttle + dataset
- `getBoundingClientRect` 返回元素的大小以及相对于视口的位置
- 监听 `scroll`事件时加入节流
- 将dataset.src设置为src`img.src = img.dataset.src;`

## IntersectionObserver
- 判断图片出现在了当前视口。
