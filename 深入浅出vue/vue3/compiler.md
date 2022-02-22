# Compiler - 实现 template 到 render 函数的转换
![](/image/f73a526b9f578074c6268a620a6c1f6.png)

## 整体流程
- 将 template 解析成抽象语法树(AST)
- 通过 transform 对代码进行优化，例如：静态标记，vue中的语法
  - 默认使用 ast.flag 标记节点的动态状态, 通过 |= 运算标记，例如：
    ```js
    arg.flag |= PatchFlags.EVENT
    ```
  - 冒号开头的就是动态的属性传递，并且把 class 和 style 标记了不同的 flag
  - 如果都没有命中的话，就使用 `static:true`，标记为静态节点。
- 通过 generate 生成 render 函数

```JS
function compiler(template) {
  const ast = parse(template)
  transform(ast)
  return generate(ast)
}
```
