# composition

- React里的hook，将需要的函数或者功能类似钩子的形式钩进来使用。主要是解决React里的组件没有状态的问题。

# 对比options
- 代码可读性。options代码逻辑，数据分块，可读性差。
- 逻辑复用，会有命名冲突，数据来源不明的问题。
- TS兼容差。

# vue3
- composition，脱离了this上下文，更好做代码推断；拆分更符合逻辑；
- 内置了teleport、fragment、suspense等组件；
- 自定义渲染器，功能模块分离，类似monorepo，响应式，编译，运行时分离。更好开发跨端
- TS重构；