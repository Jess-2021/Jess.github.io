# 1. webpack执行流程分析

1. entry-option。对配置，插件进行初始化。
2. `compiler run`。创建 compiler ，并执行 run 方法，开始编译
3. make。构建阶段。从entry开始递归分析依赖，对每个依赖进行 build（代码打包）
  1. before-resolve。解析模块的位置。
  2. build-module。开始构建模块。
  3. normal-module-loader。将loader加载完成的module进行编译，生成AST
7. program。遍历AST，收集require依赖
8. seal。所有依赖 build 完成后，进行资源生成，进行优化
9. emit。输出到dist

# 2. compiler hooks - 触发时机，参数，示例
## 流程相关
- before run
- before after compile
- compiler.hooks.make -> `正式开始编译`时触发（EntryPlugin 基于此钩子实现 entry 模块的初始化）
- compilation.hooks.optimizeChunks -> `seal` 函数中，chunk 集合构建完毕后触发（SplitChunksPlugin）
- compiler.hooks.done -> 编译完成后触发（webpack-bundle-analyzer 插件基于此钩子实现打包分析）

## 监听相关
- watch run
- watch close

## 3. compilation hook
- compiler.hooks.compilation -> 启动编译创建出 compilation 对象后触发
- finish（错误上报）
- seal。资源输出，优化

# 4. 流程分析
## 准备阶段
- `初始化参数`：对options里的plugin在compiler上进行挂载，最后的插件都会成为compiler的实例（调用插件的apply方法）。
- `创建编译器对象`：创建`compiler`，并在compiler里创建`compilation`。
- `初始化模块工厂`: 并注入内置插件。创建各种模块工厂函数的创建。
- `开始编译`：进入compiler run函数，清除构建缓存后，触发should emit钩子，进入构建环节「run」。

## 模块构建，资源生成

1. `从入口开始编译模块` ：在compile里触发 `make钩子` ，根据配置中的entry找出所有的入口文件，触发 `compilation.addEntry` ，转化为 `dependence对象` ，并加到compilation的entry里。

2. 之后，会运行 `buildModule` 方法，其中会跑一个 `loader-runner` ，去执行 `loader` ，将 `module` 里的依赖经过转化。之后会运行「parser」方法，可以将依赖进行递归收集，存储到 `compilation` 上的 `module` 上。
  - 在调用各种 `loader` 转化为JS文本时，会调用 `acorn` 将 JS 文本解析为`AST`；
  - 为的是通过AST处理好依赖关系；

3. 构建好后，会触发一个 `finishModules钩子` ，得到了每个模块被翻译后的内容以及它们之间的`依赖关系图`。并存放到composition的modules里。

## 生成dist

- 生成对应的chunk后，会进入`seal环节`。做一系列的 `优化和创建hash` 或者根据传入的hash生产hash，并把内容放到 `compilation` 里的 `asset` 里。
  - 构建 `ChunkGraph` 对象
  - 按 `compilation.modules` 中，entry、动态引入的规`分别`分配不同的 chunk 对象（以至于之后有了 `SplitChunksPlugin` 等进一步分chunk的策略插件）；
- 最后，emit阶段输出文件到硬盘。

## 5. module到chunk生成算法
- 会将 entry 对应的 module 都生成一个 chunk 。
- 遍历 module 依赖列表，将依赖的module加入到chunk中。
- 如果 module 里有动态引入的模块，那就会根据这个module创建一个新的chunk，随后继续遍历。
- 重复上面的操作，直到得到所有chunk。

## 6. compiler 和 compilation
- 特征：
  - compiler 包含了 webpack 环境所有的配置信息，包含了 options，loaders，plugins等。会在webpack启动时被实例化。
  - compilation。包含了当前的模块资源，编译生成的文件，变化的文件等。每当一个文件变化时，一次新的Compilation会被创建，也提供了很多事件回调做扩展。
- 区别：
  - compiler 代表整个 webpack 从启动到关闭的生命周期，而 compilation 代表一次新的编译。