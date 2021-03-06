# Nginx

## 定义：
  - 一个高性能的HTTP和方向代理web服务器，同时也提供IMAP/POP3/SMTP服务（邮件）。

## 优点：
  - 高并发量。「异步非阻塞」
    - 异步：调用之后直接返回，等有结果之后消息通知或者调用回调函数处理。「指epoll的异步机制，通过消息通知」
    - 非阻塞：调用之后，需要轮询去确认是否满足需求去处理。「nginx指对于建立连接的socket都是采用非阻塞的模式进行数据处理」
  - 内存消耗小 - 请求 -> 事件处理，不需要创建线程，不需要上下文切换
  - 配置简单，性能稳定
    - 稳定：分阶段资源分配技术，使CPU和内存占有率低

## 用途

- web服务器: nginx可以作为静态页面的web服务器，支持CGI协议的动态语言
- 反向代理：客户端向服务端发送请求后，反向代理将请求转发给内部的后端服务器，得到响应后再返回给到客户端。
  - 优势：
    1. 隐藏目标服务器，提高网络的安全性。
    2. 可以多个服务器提供服务，提供负载均衡功能，缓存功能。
  - 实现：
    ```JS
    proxy_pass指令 -> proxy_pass url
    ```