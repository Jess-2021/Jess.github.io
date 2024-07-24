# JS如何阻塞DOM解析

## 什么是DOM
- DOM是生成页面的基本数据结构，并赋予JS操作文档的接口，又是抵御不安全内容的防线。

## DOM树如何生成
- 当网络进程通过`content-type`判定收到的内容是一个HTML文件时，会为该请求选择或者创建一个渲染进程。
- 渲染进程准备好后，会在网络进程和渲染进程之间创建一个管道。收取网络进程传过来的字节流数据。
![](https://static001.geekbang.org/resource/image/1b/8c/1bfcd419acf6402c20ffc1a5b1909d8c.png)
- 收到的字节流数据，HTML解析器通过分词器，生成Node。通过维护一个「token栈」，生成一棵DOM树。
- 同时，渲染引擎还有一个「XSSAuditor」安全检查模块。分词器解析出来token后，会检查模块是否安全，是否符合CSP规范，是否跨站点请求。

## 影响DOM解析的两种情况
![](https://static001.geekbang.org/resource/image/76/1f/7641c75a80133e747aa2faae8f4c8d1f.png)
- 下载JS，css，执行JS或者生成CSSOM，都会导致浏览器主进程处于空闲状态。

### JS如何影响DOM生成
- 如果遇到了`<script>`脚本，此时HTML解析器会暂停DOM解析，因为JS里可能会修改生成的DOM的结构。
- 如果遇到「引入」的JS脚本，（不带`async`和`defer`属性）会先暂停DOM解析，先下载这段JS代码，在执行JS代码，再解析DOM。

### CSS如何影响DOM生成
- 「JS脚本需要用到cssOM这个前置依赖」
- 遇到css文件时，也会去对CSS文件进行下载。
- 当解析DOM时，遇到了JS脚本，会先下载和执行JS脚本，由于`JS里可能会操作CSSOM的内容，所以需要在执行JS脚本前，先构建好CSSOM`，在去执行JS，这就是CSS阻碍DOM解析的情况。
  - 例如：如果HTML从未解析到过css相关节点则立即执行`<script/>`。(此时页面会把`<script/>`之前的内容都显示在页面上)
  - 如果HTML已经解析到过css相关节点则等待css相关节点解析完成后再执行<script/>。(在CSS解析完的一瞬间会触发之前所有等待CSS资源解析的任务，假如在解析<script/>之前还有<div/>的话，理论上<div/>应该在执行<script/>之前被绘制到页面上，但因为Chrome是按照贞为单位来进行元素的绘制的，如果绘制<div/>与执行<script/>的时间在一贞之内，则会因为在绘制<div/>时被js阻塞，所以实际上需要等js执行完才会实际完成<div/>的绘制)

### 预解析
- 当渲染引擎收到字节流后，会开启一个预解析「线程」`不阻塞`。用来分析HTML文件中的JS，css相关文件，会提前下载这些文件。
- 由于JS可能会修改css的内容，所以执行js的时候，还需要等外部的css下载，解析成CSSOM对象后才执行JS。

## 总结
- css和JS都阻塞到DOM的解析，同时CSS又会阻塞JS的执行。