# vite

## 特点：
- 项目完全由esModule组成。
- 依赖预构建：
  - 将所有的代码视为原生ES模块。会将CJS或者UMD转化成ESM。
  - 将内部的依赖关系转换为单个模块。合并请求（通过HTTP来获得包源码）
- `common.js`模块不能直接应用在vite上。
- 打包还是用rollup等传统打包。
- 构建优化:
  - CSS代码分割。会将异步模块里的CSS抽离成一个单独的文件。会在chunk加载完成时通过`link`引入，该chunk会在css加载完成后执行。
  - 预加载指令生成。`modulepreload`
  - 递归解析依赖，以减少「网络往返」

## 原理：
- 解决import JS文件问题。在服务器通过拿到import的相对路径，然后返回相应的文件内容。 - 自动依赖搜寻
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
  - 但产物不支持esm模式，同时产物有多余的东西，但也导致了难以使用问题，无论是编写插件还是。

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

## 插件编写
- 返回一个插件对象的options工厂函数。
- 同时有一些rollup和vite的不同钩子

- vite遇到的问题:
1. 不支持`require`,只能使用ESM。「强制在预构建中加入某个包，然后`@rollup/plugin-commonjs`导入包。或者不用~」
2. 自定义插件。需要在解析vite配置时，判断mode，往HTML注入相应的`preload`。「插件机制」
3. 会遇到有些包暴露了`非JS`的文件。
4. 导入的文件忽略扩展名。添加到扩展名列表。
5. 不执行类型检查，只是做了对TS到JS的转译。

## 对比webpack
- 加载。vite按需加载，webpack需要全部编译完模块依赖，再进行模块加载。
- 热更新。vite只需要重新请求该模块，webpack需要将全部模块都编译一次。