# vite
- 项目完全由esModule组成。
- common.js模块不能直接应用在vite上。
- 打包还是用rollup等传统打包。

## 原理：
- 主要问题：
- 解决import JS文件问题。在服务器通过拿到import的相对路径，然后返回相应的文件内容。
- 解决第三方库引入问题。需要协商好link。例如：
```JS
import vue from "/@modules/vue"
```
然后再进行replace，映射到项目本身的node_module位置，找到引入包package中的main位置。

## 与各打包器对比

## webpack
## 优点：
  - webpack生态相对成熟。
  - webpack强调于web开发支持，内置了HMR的支持，插件系统比较强大。
## 缺点：
  - 但产物不支持esm模式，同时有多余的东西，但也导致了难以使用问题，无论是编写插件还是。

## rollup
## 优点：
  - 主要偏向于esm模块的开发，对tree shaking有很好的支持。
  - 产物相对干净，支持多种输出方式。
## 缺点：
  - 对cjs支持需要依赖插件，
  - 不支持HMR。

## esbuild
- 优点： 内置了css，react，ts等支持，编译速度极快。
- 缺点： 生态简单。

