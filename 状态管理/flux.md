# flux架构
![](https://www.ruanyifeng.com/blogimg/asset/2016/bg2016011503.png)
- view。视图
- action。动作，视图发出的动作
- mutation。用来接收action，执行回调，将`action`传递给`store`。
- store。数据，数据更新后通知view。

## 特点：
- 单向数据。