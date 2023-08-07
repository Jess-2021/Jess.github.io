# ES5/ES6 的继承除了写法以外还有什么区别
- class 声明会提升，但不会初始化赋值，有暂时性死区概念
- class 内部会启用严格模式
- class 内所有方法不能枚举
- class 内所有方法，没有原型对象，也没有[[construct]]，不能进行 new 调用
- 必须使用 new 调用 class

# 