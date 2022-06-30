# 强类型与弱类型

## 强类型的优点：
- 程序编译阶段确定属性的偏移量，即可通过偏移量代替属性名访问，从而不需要额外的空间存储属性名
- 运行时，性能较好，可文档化。

## 弱类型：
- 性能可改善（V8引擎）
- 灵活性
- 隐藏错误可以通过单元测试发现，文档可以通过工具生成

# 接口

## 注意点
- 鸭式变形，主要满足接口要求，即可满足编译要求
- 可通过二种方式跳过鸭式变形
  - 类型断言
    ```ts
    {} as Result
    <Result>{}
    ```
  - 字面量定义
    ```ts
    render({})
    ```
- 可索引类型接口
  ```ts
  interface S {
    [index: number]: string
  }
  ```

## 接口与类

- 接口约束类时，只能约束类的公有属性（不能是私有，构造属性）
- 一个接口可以继承多个接口
  ```ts
  interface Man extends Human, Child {}
  ```
- 接口可以继承类, 同时会继承类的私有成员
  ```ts
  class A {
    state = 1
  }

  interface B extends A {}

  interface C implements B {
    state = 1
  }

  ```

# 泛型

## 泛型约束类成员

- 泛型不可约束静态成员
  ```ts
  class A<T> {
    static run(value: T) {}  // ! error
  }
  ```
- 泛型约束。继承一个另外的interface，该i里即为约束条件。
  ```ts
  interface L {
    length: number
  }
  function F<T extends L>(value: T) {
    value.length // ✅
  }
  ```

# 类型兼容性 - 接口，类，函数

## 接口兼容性，鸭式变形法，具备目标类型的元素，即可视为目标类型
```ts
interface X {
  a: any;
  b: any;
}
interface Y {
  a: any;
  b: any;
  c: any;
}
let x: X, y: Y
x = y // ✅
y = x // ❌
```

## 函数兼容性
- 定义：当类型y可以被赋值为另一个类型x时，就可以说类型X兼容类型Y: x兼容y => x = y

- 结构之间的兼容，成员少的兼容成员多的
- 函数之间的兼容：参数多的兼容参数少的
```ts
type Handler = (a: number, b: number) => void
function F(h: Handler) => void

// 1. 参数个数必须多于类型的参数个数
// 定参 > 可选（a?: any） > 不固定（...args: any[]）

// 2. 参数类型 => 对象
interface P1 {
  x:number;
  y:number;
  z:number;
}
interface P2 {
  x:number;
  y:number;
}

let p2: P2, p1: P2

// 成员多的兼容成员多的
p1 = p2 // ✅
p2 = p1 // ❌

// 3. 返回值类型 // 同鸭式变形法
let f = () => { name: string }
let g = () => { name: string, age: number }
f = g
```

# 类型保护

- ts能够在特定的区块保证变量属于某种确定的类型

```ts
// 1. instanceof
if (a instanceof A) {}

// 2. in
if (a in A) {}

// 3. typeof
if (a typeof A) {}

// 4. 类型保护函数
function isA(a: A | B): a is A {
  return a as A
}
```