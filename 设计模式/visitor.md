# 访问者模式

- 一个「作用于某对象结构中各元素」的操作，使得在「不改变各元素的类」的前提下定义作用于这些元素的新操作。

## 角色：
  - 抽象访问者：抽象类或者接口，声明访问者可以访问到哪些元素，`visit`
  - 访问者：实现抽象类所声明的方法，定义访问者访问到一个类后该干什么。

  - 抽象元素类：抽象类或者接口，声明接收哪一类访问者访问，`accept`。一般有两类方法：本身的业务逻辑，接收哪类访问者来访问。
  - 元素类：实现`accept`方法。
  - 枚举对象：容纳不同元素的容器。

```JS
// 抽象访问者
abstract class Visitor {
  abstract visit(element) => void
}

// 抽象元素
abstract class Element {
  abstract accept(visitor) => void
}

// 访问者
class xxxVisit extends Visitor {
  constructor() {
    super()
  }

  visit(element) {
    element.doSomething()
  }
}

// 元素
class xxxElement extends Element {
  constructor() {
    super()
  }

  accept(visitor) {
    visitor.visit(this)
  }

  doSomething() {
    // 本身逻辑
  }
}

// 调用
let ele = new xxxElement()
let v = new xxxVisit()
ele.accept(v)
```