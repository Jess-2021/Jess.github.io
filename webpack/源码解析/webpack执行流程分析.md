# webpack执行流程分析

1. entry-option。对配置，插件进行初始化。
2. run。开始编译
3. make。从entry开始递归分析依赖，对每个依赖进行build（代码打包）
4. before-resolve。解析模块的位置。
5. build-module。开始构建模块。
6. normal-module-loader。将loader加载完成的module进行编译，生成AST
7. program。遍历AST，收集require依赖
8. seal。所有依赖build完成后，进行优化
9. 输出到dist

## 准备阶段
- 对options里的plugin在compiler上进行挂载，最后的插件都会成为compiler的实例。
- 初始化entry-plugin进行初始化。

- 进入compiler，创建compilation.
- 创建NormalModule，ContextModule工厂函数的创建。
- 进入compiler run函数，清除构建缓存后，触发should emit钩子，进入构建环节「run」。

## 模块构建，资源生成
- 在compile里触发make钩子，然后会触发一些entry插件的监听（DynamicEntry, singleEntry等）。
- 然后，singleEntry里会往「compilation」里添加entry，从而触发真正的「构建阶段」。
- 构建好后，会触发一个finishModules，会拿到经过build处理后的代码。
- 之后，会运行buildModule方法。会进入NormalModule里的doBuild方法，会跑一个loader-runner，去执行「loader」，其中需要路径（也就是第四步获取到的模块位置）。之后会运行「parser」方法，可以将依赖进行递归收集，存储到compilation上的module上。到此，构建阶段完成。

### module到chunk生成算法
- 会将entry对应的module都生成一个chunk。
- 遍历module依赖列表，将依赖的module加入到chunk中。
- 如果module里有动态引入的模块，那就会根据这个module创建一个新的chunk，随后继续遍历。
- 重复上面的操作，直到得到所有chunk。