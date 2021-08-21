# webpack执行流程分析

## 准备阶段
- 对options里的plugin在compiler上进行挂载，最后的插件都会成为compiler的实例。
- 初始化entry-plugin进行初始化。

- 进入compiler，创建compilation.
- 创建NormalModule，ContextModule工厂函数的创建。
- 进入compiler run函数，清除构建缓存后，触发should emit钩子，进入构建环节。