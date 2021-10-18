## interface vs type
- 共性：定义描述变量的形状和签名
- 不同：
  1. 类型别名可以用于一些其他类型，例如：原始类型，联合类型，元组
  2. 接口和类型别名都能被扩展，语法不同，接口和类型别名不互斥。
  ```TS
  // interface
  interface PartialPointX { x: number }
  interface Point extends PartialPointX {
    y: number
  }

  // type
  type PartialPointX = { x: number };
  type Point = partialPointX & { y: number }
  ```
  3. implements
  ```TS
  interface Point { x: number, y: number }
  class SomePoint implements Point { x = 1, y = 2 }

  type PartialPoint = { x: number } | { y: number }
  // Error 类不能实现使用类型别名定义的联合类型
  class SomePartialPoint implements PartialPoint { x = 1; y = 2 }
  ```
  4. 接口可以被定义多次，自动合并为一个接口。
  ```TS
  interface Point { x: number; }
  interface Point { y: number; }

  const point: Point = { x: 1, y: 2 };
  ```