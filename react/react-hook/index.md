# 理解 hooks
- 把某个目标结果钩到某个可能会变化的数据源或者事件源上，那么当被钩到的数据或事件发生变化时，产生这个目标结果的代码会重新执行，产生更新后的结果。
- 一旦调用了 hooks 的函数，即是一个 hook。

- 函数和对象不同，并没有一个实例的对象能够在多次执行之间保存状态？
- 符合 state => view 的思想

# 好处
- 逻辑复用，`hooks` 中被钩中的数据源，可以是另一个 `hook` 的执行结果。
- 关注分离。
- 使用场景：
  - 抽取业务组件
  - 封装通用逻辑
  - 监听状态
  - 拆分复杂组件

# 使用
- 顶层作用域。所有 Hook 必须要被执行到。第二，必须按顺序执行。不能在 `循环、条件判断或者嵌套函数` 内执行.
  - 在 `React` 组件内部，其实是维护了一个`对应组件的固定 Hooks 执行列表`的，以便在 `多次渲染` 之间保持 Hooks 的状态，并做对比。
- 只能在函数组件内，或者是在自定义的 Hooks 里面。

## state 定义准则
- 状态最小化原则，避免冗余的状态
- 唯一数据源原则，避免中间状态

# 设计模式
- 容器模式。解决hook的条件执行问题。通过多引用一个 `component` 来处理条件的逻辑。

- render props。当我们需要重用一些ui逻辑时。把一个 render 函数作为属性传递给某个组件，由这个组件去执行这个函数从而 render 实际的内容。
```js
function CounterRenderProps({ children }) {
  const [count, setCount] = useState(0);
  const increment = useCallback(() => {
    setCount(count + 1);
  }, [count]);
  const decrement = useCallback(() => {
    setCount(count - 1);
  }, [count]);

  return children({ count, increment, decrement });
}

// ...
  return (
    <CounterRenderProps>
      {({ count, increment, decrement }) => {
        return (
          <div>
            <button onClick={decrement}>-</button>
            <span>{count}</span>
            <button onClick={increment}>+</button>
          </div>
        );
      }}
    </CounterRenderProps>
  );
```
