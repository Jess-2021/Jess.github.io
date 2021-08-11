# 渐进式网页应用

- 通过渐进式增强web的优势，技术手段渐渐缩短与本地应用，小程序的差别。
- service worker，在页面和网络之间新增一个拦截器。用来缓存和拦截请求。
  - 让其运行在主线程之外。
  - 可以让SW接受服务器推送的消息，实现消息推送。
  - 只能是HTTPS
![](https://static001.geekbang.org/resource/image/23/12/23b97b087c346cdd378b26b2d158e812.png)