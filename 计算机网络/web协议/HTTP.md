# 自顶向下解析HTTP1.1

## HTTP定义
- 无状态，应用层的，请求 / 应答，语义可扩展的，自描述消息，超文本系统。

## OSI模型与TCP/IP模型
![](/image/6bcedb1b71c458ebc3b79b53ba42008.png)
- 优点：方便更改当前层级的结构。
- 缺点：一个传输需要经过多个层级，降低效率。

## HTTP解决什么问题?
- world wild web。主要解决人与机器通讯的问题。
- 为了解决www信息交互面对的需求：
  - 低门槛。
  - 可扩展性，巨大的用户群体，超长的寿命。
  - 分布式系统下的超文本媒体数据，大粒度的网络传输。（视频，音乐）
  - 不可预测流量负载，非法格式的数据，恶意信息。
  - 不可保持多个请求间的状态信息。
  - 新老组件并存，向前兼容。

## URI
- 和url的区别。
  - URI是URL和URN的超集。
- 为什么需要URI编码：
  - 存在了用作分隔符的字符。
  - ASCII码中不可显示的字符
  - URI中规定的保留字符
  - 不安全字符（可能会被不正确处理），空格，引号，尖括号。
- 如何编码？
  - % + 两个16进制的字符。
  - 中文用utf-8，在使用US-ASCII


## HTTP请求头

- 常见方法：
  - GET。获取信息，大量性能优化都针对该方法。幂等
  - HEAD。服务器不发送body，以获取HEAD元数据。幂等
  - POST.提交FORM表单，新增资源。
  - PUT.更新资源，带条件时是幂等。
  - DELETE.删除资源，幂等方法。
  - CONNECT.建立tunnel隧道。「正向代理」
  - OPTIONS.显示服务器对访问资源支持的方法。幂等，「跨域」
  - TRACE.回显服务器收到的请求。已移除

## 响应码分类
- 如果客户端收到了不认识的响应码，会按系列的第一个响应码进行处理。
## 1xx。服务器接收到了，需要做进一步操作。
- 100 continue：上传大文件前使用。
- 101 switch protocols：协议升级使用。客户端发起请求中携带upgrade头部触发，升级websocket或者http2.0
- 102 Processing. webDAV请求或者涉及文件操作的子请求。表示服务器已收到请求，但需要经过长时间操作才能完成。类似TCP断开时的close-wait2环节。为了防止客户端超时，

## 2XX成功。处理请求
- 201 created。服务端有新资源被创建。例如：put请求
- 202 accepted。服务器接受到请求，但未处理完成。例如：异步，需要长时间处理的任务。
- 204 no content。成功执行请求但不携带响应体，PUT请求。不需要更新视图
- 205 reset content。成功执行请求但不携带响应体，PUT请求。需要更新视图。
- 206 partial content。range协议时返回部分响应内容的响应码。

## 3XX 重定向使用location指向缓存中的资源。并且不超过5次
- 300 multiple choices  提供多种选择给到客户端选择
- 301 move permanently.永久性重定向
- 302 found，临时重定向到另一个URI中
- 303 see other:重定向到其他资源。post / put方法
- 304 not modified 可以利用缓存

## 4XX 客户端出现错误
- 400 bad request：客户端出现错误。例如HTTP请求格式错误
- 401 unauthorized: 用户认证信息缺失。源服务器返回
- 407 proxy authentication required:认知信息未通过代理服务器验证。
- 403 forbidden: 服务器理解请求的含义，但没有权限执行此请求。
- 404 not found：服务器没有找到对应的请求。
- 410 gone：服务器找不到该资源，并且确定知道永久找不到该资源。
- 409 conflict 资源冲突。上传文件目标版本已经存在版本更新的资源。
- 413 payload too large/request entity too large:请求的包体超出服务器处理的最大长度。

## 5XX 服务器端出现错误
- 500 server error：服务器内部错误
- 501 not implemented：服务器不支持实现请求所需要的功能
- 502 bad gateway:代理服务器无法获取合法请求
- 503 service unavailable 服务器资源尚未处理好当前请求。
- 504 gateway timeout：代理服务器无法及时从上游获取响应，超时

## 长连接 Connection：keep-alive
- 为了避免老的代理服务器识别不了connection，会使用proxy-connection代替。

## 请求和响应的上下文 - referer,server,host
- referer
  - 浏览器对于来自某一个页面请求自动添加的头部。当来源是本地文件file,data URI时；当前请求页面是http，来源页面是https时。
  - 通常用于统计分析，缓存优化，防盗链（图片，资源不希望被某些浏览器引用）
- form
  - 网络爬虫
- server
  - 服务器所用软件的信息

## 内容协商和资源表述 - [accept,content]type，encoding，
- 接受内容协商
  - accept（资源类型），accept-language（表述语言），accept-encoding（内容编码）等
- 资源表述
  - content-type（资源类型），content-encoding（资源压缩）

## HTTP包体 - content-length，transfer-encoding
- 当服务端能确定包体的全部长度时：
  - content-length：字节长度必须与实际传输的字节长度一致。接收端处理也相对简单
- 当不能确定包体的全部长度时，使用transfer-encoding表示头部content-length应该被忽略。
  - transfer-encoding：chunk。
  - 有利于长连接持续推送动态内容。
  - 有利于边发送边压缩
  - 必须再发送完成时才返回头部

## form表单的多种资源表述 - content-type：multipart/form-data
- 可能会有不同资源类型的格式，字节流

## 多线程，断点续传，随机点播 - accept-range
- 客户端明确任务从哪里开始下载（确定是否有已下载的文件，已下载的文件是否再服务端发生改变，使用几个线程并发下载），然后下载文件的指定部分，最后拼装成统一的文件。
- ## 条件请求：if-range：[e-tag | last-modified] | http-date
- ## 服务端响应：
  - 206 partial content：
    - content-range显示当前包体在完整包体中的位置。
  - 416 range not satisfiable:
    - 请求范围不满足实际资源的大小
- ## 多重范围 - content-type：multipart/byteranges

