# WebComponents
 
## 组件化 - 高内聚低耦合
- 对内各个元素紧密结合，对外联系少，接口简单。
- 产生的原因：HTML和css的全局性。
- 解决方案：
  - template。
  - 「shadow DOM」。将模板中的内容和全局的DOM，css做隔离，类似产生了一个作用域。当通过DOM接口去查找元素时，渲染引擎会去判断标签下是否有shadow-root是否是shadow DOM，如果是则跳过。
  - custom element