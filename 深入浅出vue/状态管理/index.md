# vuex

- 意义：解决复杂项目中，组件之间，`多值传递`时的复杂，还有值的`响应性`问题，是一份全局的响应式数据

- 简单的项目可以通过一个全局的reactive解决传值问题；

- [手写 mini-vuex](https://github.com/Jess-2021/Jar-learn/blob/master/vue/miniVuex.js)

# flux架构 - 单向数据流
![](https://www.ruanyifeng.com/blogimg/asset/2016/bg2016011503.png)
- view。视图
- action。动作，视图发出的动作
- mutation。用来接收action，执行回调，将`action`传递给`store`。
- store。数据，数据更新后通知view。

# 下一代的vuex - Pinia
- 旧的API设计对于类型推断不友好，内部管理了一套 state，没有导出，以至于拿不到类型；

