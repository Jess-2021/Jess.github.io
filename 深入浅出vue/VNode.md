# VNode
- DOM元素上有的属性，VNode对象都存在对应的属性。
- 颗粒度适中，是因为VNode找到新旧节点「不一样的节点」去修改真实的DOM。

节点类型：
- 注释节点。
- 文本节点。
- 克隆节点。优化静态节点和插槽节点。在后续的更新中「不需要执行渲染函数」，重新生成VNode。
- 元素节点。tag，data（例如：attrs，class，style），children（子节点列表），context（vue实例）
- 组件节点。componentOptions，componentInstance。
- 函数式组件。context，options。