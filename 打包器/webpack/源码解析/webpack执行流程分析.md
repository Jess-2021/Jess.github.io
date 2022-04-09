# 1. webpack执行流程分析

1. entry-option。对配置，插件进行初始化。
2. `compiler run`。创建compiler，并执行run方法，开始编译
3. make。构建阶段。从entry开始递归分析依赖，对每个依赖进行build（代码打包）
  1. before-resolve。解析模块的位置。
  2. build-module。开始构建模块。
  3. normal-module-loader。将loader加载完成的module进行编译，生成AST
7. program。遍历AST，收集require依赖
8. seal。所有依赖build完成后，进行资源生成，进行优化
9. emit。输出到dist

# 2. compiler hooks
## 流程相关
- before run
- before after compile
- make
- after emit
- done

## 监听相关
- watch run
- watch close

## 3. compilation hook
- addEntry -> addModuleChain
- finish（错误上报）
- seal。资源输出，优化

# 4. 流程分析
## 准备阶段
- `初始化参数`：对options里的plugin在compiler上进行挂载，最后的插件都会成为compiler的实例（调用插件的apply方法）。
- `创建编译器对象`：创建`compiler`，并在compiler里创建`compilation`。
- `初始化模块工厂`: 并注入内置插件。创建各种模块工厂函数的创建。
- `开始编译`：进入compiler run函数，清除构建缓存后，触发should emit钩子，进入构建环节「run」。

## 模块构建，资源生成

1. `从入口开始编译模块`：在compile里触发`make钩子`，根据配置中的entry找出所有的入口文件，触发`compilation.addEntry`，转化为`dependence对象`，并加到compilation的entry里。

2. 之后，会运行「buildModule」方法，其中会跑一个`loader-runner`，去执行loader，将module里的依赖经过转化。之后会运行「parser」方法，可以将依赖进行递归收集，存储到compilation上的module上。

3. 构建好后，会触发一个`finishModules钩子`，得到了每个模块被翻译后的内容以及它们之间的`依赖关系图`。并存放到composition的modules里。

## 生成dist

- 生成对应的chunk后，会进入`seal环节`。做一系列的「优化和创建hash」或者根据传入的hash生产hash，并把内容放到「compilation里的asset」里。
- 最后，emit阶段输出文件到硬盘。
## 5. module到chunk生成算法
- 会将entry对应的module都生成一个chunk。
- 遍历module依赖列表，将依赖的module加入到chunk中。
- 如果module里有动态引入的模块，那就会根据这个module创建一个新的chunk，随后继续遍历。
- 重复上面的操作，直到得到所有chunk。

## 6. compiler 和 compilation
- 特征：
  - compiler包含了webpack环境所有的配置信息，包含了options，loaders，plugins等。会在webpack启动时被实例化。
  - compilation。包含了当前的模块资源，编译生成的文件，变化的文件等。每当一个文件变化时，一次新的Compilation会被创建，也提供了很多事件回调做扩展。
- 区别：
  - compiler代表整个webpack从启动到关闭的生命周期，而compilation代表一次新的编译。