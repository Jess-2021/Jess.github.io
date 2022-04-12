# OSI 和 TCP/IP 网络分层模型
- OSI 开放式系统互联通信参考模型

## 两个分层的映射关系
![](/image/5e14a7da7db9fc6dddb528a8a124c95.png)

## 协议栈
![](/image/6ba9ad05efbcf984b33cb9801fed9cb.png)
- 发送数据，从顶层往底层，逐层添加本层的专有数据；
- 下层对于上层来说，是完全透明的；

## 相关名词
- 二层转发：工作在链路层，帧在经过交换机设备时，检测帧头部信息，拿到mac地址，进行本地转发和广播；
- 三层路由：工作在IP层，报文经过有路由功能的设备，分析报文中的头部信息，拿到IP信息，根据网段，进行本地转发或选择下一个网关；

# 大文件传输

## 数据压缩：
```http
// 浏览器 -> 服务器
Accept-Encoding: gzip / deflate / br
// 服务器
Content-Encoding: gzip
```

## 分块传输
- 流式数据，分块的格式是 16 进制长度头 + 数据块；
  ```HTTP
  Transfer-Encoding: chunked
  ```
- 确切长度的块
  ```HTTP
  Content-Length: number
  ```
- 范围请求可以只获取部分数据, 分块请求
  - 同时range是针对原文件的大小；
  ```HTTP
  // S => C 告知支持范围请求
  Accept-Ranges: bytes
  // 同时不同范围会有 F：416 请求有误，T: 206 Partial Content
  Range: bytes=0-31
  ```

- 一次请求多个范围
  ```HTTP
  //  multipart/byteranges; 表示报文的 body 是由多段字节序列组成的
  // boundary=xxx 段之间的分隔标记。
  Content-Type: multipart/byteranges; boundary=00000000001
  ```
  ```HTTP
  --00000000001
  Content-Type: text/plain
  Content-Range: bytes 0-9/96
  
  // this is
  --00000000001
  Content-Type: text/plain
  Content-Range: bytes 20-29/96
  
  ext json d
  --00000000001--
  ```