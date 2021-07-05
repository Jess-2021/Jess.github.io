# 变量提升

- js开始执行的时候，会先对程序进行编译，其中会生成执行上下文和可执行代码。
![](https://static001.geekbang.org/resource/image/06/13/0655d18ec347a95dfbf843969a921a13.png)
- 在生成的执行上下文中，会生成变量环境和词法环境。

    * 生成变量环境中，会对```var```定义的，或者全局变量和函数声明提升到开头，并将变量设置为默认值。
    ```JS
    // 程序
    var showName = function() {}
    var myName = 'Jararvis'
    if (0) var myName2 = 'Jarvis'
    function showName2() { console.log('showName被调用');}

    // 变量提升部分
    var showName = undefined // 把函数showName提升到开头
    var myname = undefined
    var myName2 = undefined
    function showName2 = function() { console.log('showName被调用');}

    // 可执行部分
    showName = function() {}
    myName = 'Jararvis'
    ```
    * 其中，函数的处理是，在变量中存储的是函数的地址。JS引擎发现了一个函数，会先将函数定义存储到堆（HEAP）中，并在环境对象中创建一个函数名属性，例如：showName，然后将该key指向Heap中的地址。

# 调用栈（管理多个执行上下文）
- 程序执行的时候，会生成一个调用栈，里面包含有各个函数的执行上下文（见变量提升图），包括全局执行上下文，在一个函数执行完毕后上下文才会被销毁。（eval函数中，代码也会被编译，并创建执行上下文。）
- 当函数调用层级到达一定大的数量后，超过了浏览器执行上下文栈的数量后，就会产生栈溢出。（可以将其改为循环调用，或者适当用消息队列的形式解决问题 - 定时器：分割成多个小任务。）

# 块级作用域

- JS由于刚开始时设计时只是个脚本语言，采用了简单的设计。所以变量无论在哪里定义，都会被提取到执行上下文的变量环境中。也就是JS在es6之前只有两种作用域：全局作用域，函数作用域（函数内部定义的变量或函数，在函数执行完后销毁）。在es6后，JS做到了既支持变量提升的特性，又支持了块级作用域。

- 块级作用域：被{}包裹着的代码。块内变量不影响到外部的变量。

- 通过let，const定义的变量会在编译阶段放入词法环境。

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

    1. 编译并创建执行上下文。在函数内部包括代码块中，通过var声明的变量，会在编译时存到变量环境。let定义的变量，会被存放到词法环境。但此时作用域块内部的let声明的变量并没有存放在词法环境内。

    ![](https://static001.geekbang.org/resource/image/f9/67/f9f67f2f53437218baef9dc724bd4c67.png)

    2. 执行到代码块，会将let定义的变量存在词法环境一个单独的区域中，并不会和词法环境中外部的变量，例如：里面的b变量，不影响到外部的b变量，都是独立的存在。
    3. 并且，词法环境里是一个栈结构，作用域执行完后，会从栈顶弹出。

    ![](https://static001.geekbang.org/resource/image/7e/fa/7e0f7bc362e0dea21d27dc5fb08d06fa.png)
    4. 变量的查找，会沿词法环境的栈顶向下查找，找不到再到变量环境中查找。

    ![](https://static001.geekbang.org/resource/image/06/08/06c06a756632acb12aa97b3be57bb908.png)

# 作用域链

- 每一个执行上下文中，都包含一个外部引用outer，指向外部的执行上下文。当程序查找变量时，查找到变量环境时，如果找不到对应的变量，会在该outer里所指向的执行上下文查找。（而不是在函数内部的作用域查找，函数嵌套的函数被压到相应的调用栈里）
- 词法作用域：JS执行过程中，作用域链是由词法作用域决定的。

