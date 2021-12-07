# The basics

## 为什么有TS之类的工具？
- JS在运行代码前，其实不知道函数调用的结果。类似：
  ```JS
  message.toLowerCase();
  // message 否能调用？
  // message 是否有一个 toLowerCase 属性？
  // 如果有，toLowerCase 是可以被调用的吗？
  // 如果可以被调用，会返回什么？
  ```
- 静态类型系统：可以在JS运行前先计算出值的类型（包括值的类型，有什么属性和方法），在决定是否执行程序。
- 代码补全、快速修复：类型检查器有了类型信息，可以在你输入的时候列出可使用的属性、方法。

## 显示类型
```TS
function greet(person: string, date: Date)
// string, Date就是相应person，date的注解（签名），当不符合定义的类型时就会抛出错误
```
- 同时，TS类型系统可以正确推断出一些标识符相应的类型；

## TSC - TypeScript Compiler  TS编译器
- 运行成功时，会在编译的`ts`文件下产生一个`js`文件；否则，报相关的错误。
  - 错误时仍旧生成`JS`文件 -> `tsc --noEmitOnError`

- 类型抹除：编译出来的`js`文件，会将TS的独有的代码删除。
- 降级：TS会默认对`ECMAScript 2015`及以上的代码进行降级，默认转化为`ES3`
  - `tsc --target es2015 xxx.ts`指定版本。
- TS赋予了用户调整代码检查的颗粒度。TypeScript 提供的形式更像是一个刻度盘，你越是转动它，TypeScript 就会检查越多的内容。
  - `"strict": true` 严格模式
  - `noImplicitAny: true` 当隐式类型被推断为`any`时，会抛出一个错误。
  - `strictNullChecks: true` 选项会让我们更明确的处理 null 和 undefined，也会让我们免于忧虑是否忘记处理 null 和 undefined
