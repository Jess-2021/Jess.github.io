# 问题：

- 函数的无状态。导致过多的组件（函数）嵌套，导致功能，层级不分明。
- 分割函数的功能。

# 特性：
- 使函数能保持自己的状态。
- 并且有利于函数的抽离，复用。

## 程序上的特性
- 将hook保存在fiber节点上。保持了state的稳定性，顺序性。 => 链表

# 与vue3 composition的区别
- vue是将composition放在setup里的，只会执行一次初始化，而react在DOM更新时需要进行重新渲染和更新，所以需要保证其顺序性。
- 都是通过特别的api实现状态的保存，react用useState，vue用ref，reactive。
- react通过useEffect进行跟踪，vue通过watcher进行跟踪数据的变化。


