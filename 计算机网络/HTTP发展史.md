# 1. HTTP / 0.9（纯文档）
- 基于TCP同样经过3次握手。
- 建立好后会发送一个`GET`请求行信息，获取index.html
- 服务器接受到请求后，读取对应得HTML文件，将其以「ASCII」字符形式返回。
- 传输完成后断开链接。


# 2. HTTP / 1.0 - 上网群体，请求量的爆发增长
随着1994年，网络拨号上网，网络资源丰富，不再局限于ASCII编码。为了适应多种请求的需要，产生了「请求头」和「响应头」等key-value的形式。

![](https://static001.geekbang.org/resource/image/b5/7d/b52b0d1a26ff2b8607c08e5c50ae687d.png)

- 改进：
  1. 需求和返回「数据类型」的约定。
  2. 数据越来越大，所以需要对数据进行「压缩」，客户端必须知道压缩方法。
  3. 国际化「语言」。
  4. 文件的「编码」。
  ```
  accept: text/html
  accept-encoding: gzip, deflate, br
  accept-Charset: ISO-8859-1,utf-8
  accept-language: zh-CN,zh
  ```

- 新特性：
  1. 「状态码」。返回浏览器处理请求「处理结果」。
  2. 「cache机制」。减轻服务器压力。
  3. 客户端浏览器用户代理，例如：浏览器信息。

- 问题：
  1. 一次建立和断开TCP链接都需要进行三次握手和四次挥手。
  2. 页面内容动态生成，不好控制数据大小。
  3. 链接没有状态。

# 3. HTTP / 1.1 - 高效率地请求

## 新特性：
- 「改进持久链接」。在TCP链接上可以保持多个HTTP请求，只要浏览器和服务器没有断开，TCP都可以保持。只保持客户端和代理服务器的链接。
- 「不成熟的HTTP管线化」。在持久链接中，后面的请求需要等前面的请求返回后，才能请求。「HTTP队头阻塞」
  - 在此，HTTP / 1.1将多个HTTP请求整批发与服务器，但服务器还需根据请求顺序返回。
- 虚拟主机。处理同个IP多个「虚拟机」的情况。
- Chunk transfer。页面内容多数动态生成，不可预估数据大小，所以将其分割成若干个任意大小的数据块。每个数据会「带上数据的长度」。最后使用一个「0长度」的块做数据发送完成的标识。
- 客户端Cookie。身份鉴权。
- 浏览器为每个域名最多维护6个TCP持久链接。
- CDN域名分片机制。每个域名用不同的CDN加载静态资源。
![](https://static001.geekbang.org/resource/image/91/c5/91c3e0a8f13ebc4d81f08d8604f770c5.png)

## 问题 - 对带宽的利用率不理想。
1. TCP的「慢启动」。TCP建立时，刚刚开始会采用一个很慢的速度发送数据，然后再慢慢加速发送速度。直到找到一个合适的速度为止。（可能会阻塞到页面的关键资源）
2. 「同时打开多条TCP链接」，会导致链接「竞争」固定的带宽。因为慢启动的影响，每条链接速度会慢慢上升，当速度不足时又会同时「减速」。没有「优先级」。
3. 「HTTP队头阻塞」。持久链接需要等前面的请求处理完再处理后面的请求。

# 4. HTTP / 2.0

## 解决方案：一个TCP长连接和多路复用

1. TCP不能抛弃。所以设置一个域名只用「一个TCP长连接」来传输数据，这样页面同域名下的资源只需要一次慢启动即可。同时也避免了「多个TCP链接的竞争」。
2. 「多路复用」。
![](https://static001.geekbang.org/resource/image/0a/00/0a990f86ad9c19fd7d7620b2ef7ee900.jpg)
每个请求都有对应的ID，在浏览器接受到后，会筛选出同样的ID，将其拼接成完整的HTTP响应。服务器接受到请求后，也可以根据优先级和缓存，优先处理部分请求。

## 多路复用的实现
![](/image/多路复用实现.png)

##  实现：
1. 浏览器会将请求行，请求头，请求体等信息。经过二进制分帧层，转化为一个个带有「请求ID的帧」。通过协议栈将这些帧发送给服务器。
2. 服务器收到所有帧后，会将所有的帧「合并为一条完整的请求信息」。
3. 服务器处理完后，会将响应头，响应体，响应行发送给二进制分帧层。同样转化为一个个带有「响应ID的帧」。发送给浏览器。
4. 浏览器接受到后，将ID编号提交给对应的请求。

## 其他的新特性：
1. 可设置请求的「优先级」。
2. 服务器推送。
3. 头部压缩。建立head哈希表。

## 新问题：
1. 「TCP队头阻塞」
![](https://static001.geekbang.org/resource/image/33/96/33d2b4c14a7a2f19ef6677696b67de96.png)
  - 如果一个长连接中的某个请求数据出现丢包，那么整个TCP都会「暂停」等待丢失的数据重传过来。
  - HTTP1.1 由于域名分片，并且浏览器可以为域名打开6个TCP连接，一个阻断仍旧可以发送数据。但由于HTTP / 2.0是跑在一个长连接中的，所以当出现丢包时会阻塞所有的请求。
2. TCP建立的「时延」。建立TCP链接时需要花费1.5个RTT，TLS1.2、1.3需要花费1~2个RTT。再加上物理距离。

# 5. HTTP / 3.0 (QUIC)
![](https://static001.geekbang.org/resource/image/0b/c6/0bae470bb49747b9a59f9f4bb496a9c6.png)
- 在UDP中，实现了类似于TCP的多路数据流，传输可靠性，集成了TLS加密。
## 新功能
1. TCP上的流量控制，增加传输的可靠性。在UDP的基础上，新增了一层保障数据的可靠性。提供了数据包重传，拥塞控制等一些特性。
2. 集成了TLS加密。减少了所花费的RTT个数。
3. 实现了HTTP / 2.0的多路复用。在物理链接中，新增了多个独立的逻辑数据流。实现了数据的单独传输。（解决了TCP的队头阻塞问题）
4. 实现了快速握手。基于UDP，可以实现0~1RTT来建立链接。
