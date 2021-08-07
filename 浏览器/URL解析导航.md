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
  - 数据传输完后，渲染进程会发送「确认提交」给主进程。
  - 主进程收到「确认提交」后，会更新浏览器状态，安全状态，URL，history，web页面。
![](https://static001.geekbang.org/resource/image/d3/b8/d3c5a6188b09b5b57af439005ae7dfb8.png)

## 5. 渲染阶段
