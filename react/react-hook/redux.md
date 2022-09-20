
# State
其中 State 即 Store，一般就是一个纯 JavaScript Object。

# Action
Action 也是一个 Object，用于描述发生的动作。

## 异步Action
- `middleware` 可以让你提供一个拦截器在 reducer 处理 action 之前被调用在这期间可以自由处理action。
- 参数如果是一个函数，会将 `dispatch` 作为参数传给这个函数，由函数来决定什么时候发送 `action` 。其实就是对 `dispatch` 进行复用。

# Reducer
- 而 `Reducer` 则是一个函数，接收 `Action` 和 `State` 并作为参数，通过计算得到新的 Store。
- 每次都必须返回一个新的对象，确保不可变数据（Immutable）的原则