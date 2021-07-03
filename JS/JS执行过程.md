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

