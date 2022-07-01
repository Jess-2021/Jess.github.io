# SOAP & REST

## SOAP
Simple Object Access Protocol，即简单对象访问协议，定义了数据对象传输的格式，以便在网络的节点之间交换信息。（类比：http）

- 他关心把这个数据给序列化成 XML 格式的文本，在传输到对端以后，再还原回来。
- 通常通过 `http post` 发送到对端的

- 优点：藉由 XML schema，它具备更严格的检查和校验，配合 WSDL，在真正发送请求前，几乎就对所有远程接口事无巨细的问题有了答案。
- 缺点：复杂。
```SOAP
POST /books HTTP/1.1
Host: xxx
Content-Type: application/soap+xml; charset=utf-8
Content-Length: xxx

<!-- soap消息体 -->
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope
 xmlns:soap="https://www.w3.org/2003/05/soap-envelope/"
 soap:encodingStyle="https://www.w3.org/2003/05/soap-encoding">
  <soap:Body xmlns:b="...">
    <b:CreateBook>
      <b:Name>...</m:Name>
      <b:Author>...</m:Author>
      ...
    </b:CreateBook>
  </soap:Body>
</soap:Envelope>
```

## REST
Representational State Transfer，即表现层状态转换，指的是一种为了信息能在互联网上顺利传递而设计的 `软件架构风格`。

- REST 的核心要素包括资源、表现层和状态转换这三个部分。通过协议、url、方法去表现
- 幂等性指的是对服务端的数据状态，执行多次操作是否和执行一次产生的结果一样。
- 安全性指的是该操作是否对服务端的数据状态产生了影响。一定条件下，安全操作是可以被缓存的。

- 优点： 简单。
- 缺点：资源是它的核心概念。（多步操作，异步事务）
```REST
POST /v1/books HTTP/1.1
HOST: ...
Content-Type: application/json

{
  "name": "...",
  "author": "...",
  ...
}
```

# API 设计

- 核心问题，一组 Web API，就是要专注于一类问题，核心问题必须是最重要的一个。
- 实际需求和限制，选择承载技术。比如说，向前的兼容性，不同版本同时运行，鉴权和访问控制，库依赖限制，易测试性和可维护性，平滑发布（如新老接口并行）等。
- 确定接口风格。
  - 易用性 vs 通用性。“人本接口”还是“最简接口”。
  - 接口粒度的划分。大接口可以增加易用性，便于内部优化提高性能（而且只需调用一次）；设计成小接口可以增加可重用性，便于功能的组合。但接口要像是一个人设计出来的，而不是简单的组合添加。
- 定义具体接口形式。
  - 条件查询。
```
/books/123
/books/123/price
```
  - 消息正文封装。
  - 响应异常设计。