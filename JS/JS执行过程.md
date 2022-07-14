# 执行上下文 - 执行的基础设施

- 定义：JS标准中，将一段代码（包括函数），执行所需的所有信息。
- `ES2018` 中，this 被归入 `lexical environment` ，并且添加了不少内容：

  - `lexical environment` - 词法环境，当获取变量或者 this 值时使用。
  - `variable environment` - 变量环境，当声明变量时使用
  - `code evaluation state` - 用于恢复代码执行位置。
  - `Function` - 执行的任务是函数时使用，表示正在被执行的函数。
  - `ScriptOrModule`：执行的任务是脚本或者模块时使用，表示正在被执行的代码。
  - `Realm`：使用的基础库和内置对象实例。
  - `Generator`：仅生成器上下文有这个属性，表示当前生成器。

# 变量提升
解决函数 `递归调用`，`优化` 等问题。

- js开始执行的时候，会先对程序进行编译，其中会生成执行上下文和可执行代码。

![](/image/361657706206_.pic.jpg)

- 在生成的执行上下文中，会生成变量环境和词法环境。

  - 生成变量环境中，会对 `var` 定义的，或者全局变量和函数声明提升到开头，并将变量设置为默认值。
  ```JS
  // 程序
  var showName = function() {}
  var myName = 'Jararvis'
  if (0) var myName2 = 'Jarvis'
  function showName2() {
      console.log('showName被调用');
  }

  // 变量提升部分
  var showName = undefined // 把函数showName提升到开头
  var myname = undefined
  var myName2 = undefined
  function showName2 = function() {
      console.log('showName被调用');
  }

  // 可执行部分
  showName = function() {}
  myName = 'Jararvis'
  ```
  - 其中，函数的处理是，在变量中存储的是函数的地址。JS引擎发现了一个函数，会先将函数定义存储到堆（HEAP）中，并在环境对象中创建一个函数名属性，例如：showName，然后将该key指向Heap中的地址。
  - 其中，当函数和变量同名时，函数优先。

- 在ES6之前，可以通过 `IIFE` 来 `模拟块级作用域` ，构造一个函数的执行环境

# 调用栈（管理多个执行上下文）与 函数作用域

- 程序执行的时候，会生成一个调用栈，里面包含有各个函数的执行上下文（见变量提升图），包括全局执行上下文，在一个函数执行完毕后上下文才会被销毁。（`eval` 函数中，代码也会被编译，并创建执行上下文。）

- 当函数调用层级到达一定大的数量后，超过了浏览器执行上下文栈的数量后，就会产生栈溢出。（可以将其改为循环调用，或者适当用消息队列的形式（定时器：分割成多个小任务）解决问题）

# 块级作用域
JS 由于刚开始时设计时只是个脚本语言。所以变量无论在哪里定义，都会被提取到执行上下文的变量环境中。
也就是JS在 es6 之前只有两种作用域：`全局作用域`，[函数作用域](#调用栈（管理多个执行上下文）)。

- 块级作用域：被{}包裹着的代码。块内变量不影响到外部的变量。

- 通过 let，const 定义的变量会在编译阶段放入词法环境。

- 会形成暂时性死区。

```JS
function foo(){
    var a = 1
    let b = 2
    {
        let b = 3
        var c = 4
        let d = 5
        console.log(a)
        console.log(b)
    }
    console.log(b)
    console.log(c)
    console.log(d)
}
foo()
```

- 执行过程

    1. 编译并创建执行上下文。在函数内部包括代码块中，通过 `var` 声明的变量，会在编译时存到 `变量环境` 。`let` 定义的变量，会被存放到 `词法环境` 。但此时作用域块内部的let声明的变量并没有赋值。

    ![](/image/371657780707_.pic.jpg)

    2. 执行到另一个独立的代码块，会将 `let` 定义的变量存在词法环境一个单独的区域中，并不会和词法环境中外部的变量。
    3. 并且，词法环境里是一个栈结构，作用域执行完后，会从栈顶弹出。

    ![](/image/381657780960_.pic.jpg)
    4. 变量的查找，会沿词法环境的栈顶向下查找，找不到再到变量环境中查找。

    ![](/image/391657781037_.pic.jpg)

# 作用域链

- 函数能够记住定义时的变量，JS标准中规定了用来保存定义时上下文的私有属性 `[[Environment]]`，当一个函数执行时，会创建一条新的执行环境记录，记录 `函数的外层词法环境`（outer lexical environment）会被设置成函数的 [[Environment]]。即为 `切换上下文`。
- 当程序查找变量时，查找到变量环境时，如果找不到对应的变量，会在该 `outer` 里所指向的执行上下文查找，这个查找的链条就是作用域链，而作用域链是由词法作用域决定的。

## 词法作用域
指作用域是由代码中 `函数声明的位置` 来决定的，和函数怎么调用没关系，也就是不具备变量提升的作用域。

![](/image/401657781329_.pic.jpg)

# 闭包
词法作用域的规则，内部函数总是可以访问到外部函数的变量。

## 定义
- 广义上：闭包是绑定了 `执行环境` 的函数，本质还是一个函数（包含 `[[call]]` 的对象）。
- JS：在引用了外部函数返回的内部函数后，内存中保留了内部函数中所持有的词法作用域，即是闭包

## `环境`，`表达式`
  - 环境部分
    - 环境 -> 函数的词法环境（执行上下文的一部分）
    - 标识符列表 -> 函数中用到的未声明的变量
  - 表达式部分 -> 函数体

- 所以，闭包的引用最好通过局部变量的形式，全局变量的话，闭包中的变量得等到页面关闭时才销毁。

![](/image/411657782543_.pic.jpg)
# 以上知识串联和总结
![](/image/421657782573_.pic.jpg)

1. 程序预执行编译时进行变量提升，将 myName 提升到顶部，并存入全局执行上下文的变量环境，同时还有foo，bar函数。

```JS
var name = undefined;
 var bar = function() {};
 var foo = function() {};
```

2. 其次，将myAge，test存入到全局执行上下文的词法环境中。

3. foo函数调用：

    1). myName存入到变量环境，同时在变量环境中包含了外部的执行上下文，也就是全局执行上下文。

    2). 将 ` test = 2` 存入到词法环境。到{}代码块，` test = 3` push到词法环境栈中。

    3). 调用foo。

4. ` myName = '极客世界' ` 存入到变量环境，并加上外部执行作用域。` test1 = 100` 推入词法环境栈，同理，` myName = 'Chrome浏览器'` 推入。

# this - 调用它所使用的引用
为了让对象内部的方法能使用对象内部的属性。

- 他和作用域链是完全不同的两套系统，又和执行上下文绑定在一起。

## 原理 - Reference 类型
我们获取的函数表达式，实际上返回的并非函数本身，而是一个 `Reference 类型`。
- Reference 类型由两部分组成：对象和属性值
- 当做一些 `算数运算` ，reference类型才会被解引用，并获取到真正的值。例如：`函数调用，delete操作` 等。

![](/image/431657782687_.pic.jpg)

- 包括全局执行上下文中的 this - `window对象`，函数执行上下文，eval中的this；

- 改变 this 的方式
  - call设置；
  - 通过对象调用，例如：myObj.say(), this为myObj；say()，this为window
  - 构造函数中，this 指向传入的参数；

- this 缺陷
  - 嵌套函数中，this不能从外部函数中继承，一般通过变量self定义this，或者箭头函数。
    ```JS
    var myObj = {
    name : "极客时间",
    showThis: function(){
        console.log(this)
        function bar(){console.log(this)}
        bar()
    }
    }
    myObj.showThis() // '极客时间'， 'window'
    ```
  - 默认指向全局变量window。

## this关键字的机制 - [[ThisBindingStatus]]

- 不同于作用域链的 [[[environment]]](/#作用域链)， this 是一个更复杂的机制，JavaScript 标准定义了 `[[thisMode]]` 私有属性。并可能有三个取值：
  - `lexical` - 表示从上下文中找 this，这对应了箭头函数。
  - `global` - 表示当 this 为 undefined 时，取全局对象，对应了普通函数。
  - `strict` - 当严格模式时使用，this 严格按照调用时传入的值，可能为 `null` 或者 `undefined` 。
- 函数创建新的执行上下文时，会根据 `[[thisMode]]` 来标记新记录的 `[[ThisBindingStatus]]` 私有属性。
- 在代码遇到 `this` 时，会逐层检查当前此法环境记录中的 `[[ThisBindingStatus]]` ，找到有 this 环境记录的获取 this 值。

# realm
- 用来区分不同window环境下的对象原型
``` JS
var iframe = document.createElement('iframe')
document.documentElement.appendChild(iframe)
iframe.src="javascript:var b = {};"

var b1 = iframe.contentWindow.b;
var b2 = {};

console.log(typeof b1, typeof b2); //object object
console.log(b1 instanceof Object, b2 instanceof Object); //false true
```