# 输入URL到页面展示（导航）

![](https://static001.geekbang.org/resource/image/92/5d/92d73c75308e50d5c06ad44612bcb45d.png)
## 1. 用户输入
- 会判定输入的是URL还是搜索内容，如果是搜索内容，会合成带有搜索关键字的URL。
- 会触发当前页面「beforeUnload」事件钩子，如果没有监听该钩子，则会进入「URL的请求阶段」。
- 但还是页面仍旧停留在当前页面，需要等到「拿到响应数据」才进行页面的渲染。

## 2. URL请求阶段
- 浏览器会通过IPC「进程通信」将URL发送到网络进程，进行真正的URL请求流程。[HTTP请求过程](/浏览器.md)
- 查找缓存 -> DNS解析 -> 利用IP和服务器建立TCP -> HTTPS进行TLS连接 -> 处理请求内容
- 重定向。301，302。如果发生了重定向，会从Location读取地址，重新发起HTTP或者HTTPS请求。
- 响应数据的处理。Content-type返回相应的数据类型。
  - 如果是字节流类型，例如：octet-stream，会提交给浏览器的下载管理器执行。同时「URL导航到此结束」。
  - 如果是HTML类型，则继续。准备渲染进程。
- 这时请求的文档数据还在网络进程中。

## 3. 准备渲染进程
- 一般打开一个新页面会打开一个渲染进程，同一站点的会运行在一个渲染进程中。
  - 同一站点的定义：根域名（geekbang.org） + 协议（https://）
  ```
  // 同一站点
  https://time.geekbang.org
  https://www.geekbang.org
  https://www.geekbang.org:8080
  ```

## 4. 提交文档
- HTML数据提交给渲染进程。
  - 主进程接收到来自网络进程的数据后，会向渲染进程发起「提交文档」的信息。
  - 渲染进程接受到后，会和网络进程建立数据传输的「管道」。
  - 同时，渲染进程边解析收到HTML，同时「开启预解析，下载CSS和JS」。
  - 数据传输完后，渲染进程会发送「确认提交」给主进程。
  - 主进程收到「确认提交」后，会更新浏览器状态，安全状态，URL，history，web页面。
![](https://static001.geekbang.org/resource/image/d3/b8/d3c5a6188b09b5b57af439005ae7dfb8.png)

# 5. 渲染阶段

## 1. 构建DOM树 (HTML - > DOM树)

## 2. 样式计算（CSS -> computedStyle）

- 计算出每个元素的具体样式。
- 将css转化为浏览器能理解的结构。link，style，行内 -> styleSheets
- 转化样式表里的属性，使其标准化。
![](https://static001.geekbang.org/resource/image/12/60/1252c6d3c1a51714606daa6bdad3a560.png)
- 计算DOM树中每个节点的具体样式。

## 3. 布局阶段（布局树 -> 布局树）
- 创建布局树。只包含可见元素的布局树。
- 布局计算。各个节点的坐标位置。

## 4. 分层（布局树 -> 图层树）
- 拥有层叠上下文属性的图层。
- 需要剪裁（clip）的地方会被创建图层。（滚动条）
![](https://static001.geekbang.org/resource/image/7b/97/7b6ceaab23c6c6d8e5930864ff9d7097.png)

## 5. 图层绘制 paint（图层树 -> 绘制指令列表）

# PS： 以下到光栅化，都是在「合成线程」中进行，不会影响到主线程的执行。
- 图层的绘制列表准备好后，主线程会把绘制列表「提交」给合成线程。

![](https://static001.geekbang.org/resource/image/46/41/46d33b6e5fca889ecbfab4516c80a441.png)
## 6. 栅格化 raster（绘制指令 -> 图块「tile」 -> 位图）

- 会将图层切分为图块「tile」。
- 然后将视口附近的图块生成位图，其中生成位图的工作就是交给栅格化来执行的。图块是栅格化的最小单位。渲染进程通过维护一个栅格化的线程池，将所有图块转化为位图。

## 7. 快速光栅化（GPU光栅化）

- 同时，栅格化过程一般都是使用「GPU」来加速生成，生成的位图保存在GPU内存中。生成完后在返回给浏览器「进程」的合成「线程」。
- 其中涉及到「跨进程」操作。
![](https://static001.geekbang.org/resource/image/a8/87/a8d954cd8e4722ee03d14afaa14c3987.png)

## 8. 合成和显示（内存里位图 -> 页面）

- 当所有的图块被光栅化后，合成线程会生成一个绘制图层的命令「DrawQuad」，并提交给浏览器主进程。
- 浏览器进程通过GPU线程里的「viz」组件接收，然后将页面内容绘制到内存中，最后将内存里的内容显示在屏幕上。


## 总结：
![](https://static001.geekbang.org/resource/image/97/37/975fcbf7f83cc20d216f3d68a85d0f37.png)

## PS: 

### 重排：需要更新完整的渲染流水线。开销最大。
- 更新了元素的几何属性，例如：宽高。

### 重绘：更新元素的属性。相比重排，省去了布局和分层阶段。
![](https://static001.geekbang.org/resource/image/3c/03/3c1b7310648cccbf6aa4a42ad0202b03.png)

### 合成：触发绘制之后的流程。但主要部分不是在浏览器主线程上执行的，所以相比性能最好。
- 例如：css的transform动画。