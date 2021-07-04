# 变量提升

- js开始执行的时候，会先对程序进行编译，其中会生成执行上下文和可执行代码。
![](https://static001.geekbang.org/resource/image/06/13/0655d18ec347a95dfbf843969a921a13.png)
- 在生成的执行上下文中，会生成变量环境和词法环境。

    * 生成变量环境中，会对变量和函数声明提升到开头，并将变量设置为默认值。
    ```JS
    // 程序
    var showName = function() {}
    var myName = 'Jararvis'
    function showName2() { console.log('showName被调用');}

    // 变量提升部分
    var showName = undefined // 把函数showName提升到开头
    var myname = undefined
    function showName2 = function() { console.log('showName被调用');}

    // 可执行部分
    showName = function() {}
    myName = 'Jararvis'
    ```
    * 其中，函数的处理是，在变量中存储的是函数的地址。JS引擎发现了一个函数，会先将函数定义存储到堆（HEAP）中，并在环境对象中创建一个函数名属性，例如：showName，然后将该key指向Heap中的地址。

# 调用栈
- 程序执行的时候，会生成一个调用栈，里面包含有各个函数的执行上下文（见变量提升图），包括全局执行上下文，在一个函数执行完毕后上下文才会被销毁。（eval函数中，代码也会被编译，并创建执行上下文。）
- 当函数调用层级到达一定大的数量后，超过了浏览器执行上下文栈的数量后，就会产生栈溢出。（可以将其改为循环调用，或者适当用消息队列的形式解决问题 - 定时器：分割成多个小任务。）

