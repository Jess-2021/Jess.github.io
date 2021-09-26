# 优势

- 不同于vuex的单一状态树结构，能通过composition定义不同的状态树。
  - 由于状态树可以很简单，取消了mutation。直接通过action修改。
  - 通过composition分割开，所以没有命名空间模块的限制。
- 对TS有更好的支持，API接口设计type类型鲜明。

