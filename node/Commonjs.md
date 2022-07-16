# commonJS
- 由JS社区发起，在Node上得到推广，后续也影响了浏览器端的JS

## 原因：
- 脚本变多时，需要手动管理加载顺序
- 不同脚本之间的逻辑调用，需要借用全局变量，但很容易造成覆盖
- 没有HTML

## 特性
- 当一个模块被脚本引用后，默认会得到一个空对象。
```JS
// 默认情况
let lib = require('module') // lib = {}
```

- 模块内容可以通过 `exports.xx` 导出
```JS
// 模块A
exports.a = 'world'

// 脚本
let lib = require('module') // { a: 'world' }
```

- 模块和脚本导出的是同一个引用，外面也可以改变模块导出的内容。
```JS
// 模块A
exports.a = { name: 'Jess' }
setTimeout(() => { console.log(a) }, 2000) // Jess666

// 脚本
let lib = require('module') // { a: 'world' }
lib.a = 'Jess666'
```

- 在导出中也可以让`module.exports`覆盖掉之前定义的`export`对象;但模块A内部使用的`exports`还是`export`的相关内容，只是外部访问到的是`module.exports`的内容。
```JS
// 模块A
export.a = 'jess'
module.exports = function aa() {}
console.log(exports) // { a: jess }

// 脚本
let lib = require('module') // aa
lib.a //undefined
```


# 内置模块

## 内置模块调用通路：
- Node应用层级的代码 -> Node 底层库 -> c++底层接口 -> v8接口方法 -> JS变量
- 通过Node应用层级的代码，调用了Node的底层库，底层库又去调c++底层接口拿到操作系统相关信息，之后通过v8接口方法，回调后转化为JS变量。

## 操作系统 -> Node 应用代码
- 例如：eventEmitter，(观察者模式)
  ```JS
  class Learn extends EventEmitter {
    constructor() {
      super()
      setInterval(() => {
        // 每3秒触发一次事件，并传入参数
        this.emit('newLesson', { main: 'Some Front End Lesson' })
      }, 3000)
    }
  }

  const jess = new Learn()
  jess.addListener('newLesson', (res) => {
    console.log(res) // Some Front End Lesson
  })
  ```
- 应用：我们就可以不去调用外面的函数的情况下，通过事件监听器就可以在程序执行时注入逻辑。
```js
const learn = require('Learn')

jess.addListener('newLesson', (res) => {
  console.log(res) // Some Front End Lesson
})
```
