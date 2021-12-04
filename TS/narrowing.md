# narrowing
- 是什么：TS的类型检查器会考虑到类型保护（`typeof padding === number`）和赋值语句，从而将类型推导为更精确类型的过程，称之为`narrowing`。

## 内容：
- `typeof`类型保护：`typeof padding === number`
- 真值收窄：如果通过表达式判定为真值，则进行收窄。
- 等值收窄：值相等，类型也完全相等
  - 同宽松相等（可用来：方便地判段两个值不是`null`也不是`undefined`）
    ```JS
    if (value != null) {
      // no null and undefined
    }
    ```
- `in` 操作符收窄:
  ```TS
  'swim' in animal
  ```
- `instanceOf`收窄， 同`typeOf`
- 赋值语句： 赋值语句的右值，正确的收窄左值
  ```TS
  let x：string | number
  x = 'cat' // x: string
  ```
- 控制流分析: 不可达的代码不会进行类型分析。
  ```TS
  if (true) {
    x = 'Jess'
    return x
  }
  return x // NO
  ```
- 类型判断式：类型的表明，声明，断言。
  ```ts
  cat as animal
  cat in animal
  ```
- 可辨别联合：联合类型中的每个类型，包含了一个共同的字面量类型属性。TS会认为这是一个「可辨别联合」，对其进行收窄。
  ```TS
  interface cat {
    speak: 'miao'
  }
  interface dog {
    speak: 'wang'
  }

  switch(speak) {
    case 'wang':
      // ...
  }
  ```

- `never` 穷尽检查：`never`可以赋值给任何类型，没有类型能赋值给`never`。
  ```TS
  switch(type) {
    // ...
    default:
      const type:never = type
      // 如果没穷举完就会报错，可以用来判断是否穷尽了所有type的可能性
  }
  
  ```