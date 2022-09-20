# 思考方式
- hooks: 当某个状态发生变化时，我要做什么
- class: 某个生命周期方法中我要做什么。

# 构造函数 - 初始化
```js
// 创建一个自定义 Hook 用于执行一次性代码
function useSingleton(callback) {
  // 用一个 called ref 标记 callback 是否执行过
  const called = useRef(false);
  // 如果已经执行过，则直接返回
  if (called.current) return;
  // 第一次调用时直接执行
  callBack();
  // 设置标记为已执行过
  called.current = true;
}
```

# 三种常用的生命周期方法

`componentDidMount` `，componentWillUnmount` ，和 `componentDidUpdate`
```js
useEffect(() => {
  // componentDidMount + componentDidUpdate
  console.log('这里基本等价于 componentDidMount + componentDidUpdate');
  return () => {
    // componentWillUnmount
    console.log('这里基本等价于 componentWillUnmount');
  }
}, [deps])

```

## 并不完全等价
- `useEffect` 只有在依赖项变化时才被执行。而传统的 `componentDidUpdate` 则一定会执行
- callback 返回的函数，在下一次依赖项发生变化以及组件销毁之前执行，而传统的 `componentWillUnmount` 只在组件销毁时才会执行
