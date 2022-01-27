# css语法

## 分类
- CSS 的顶层样式表由两种规则组成的规则列表构成，一种被称为 at-rule，也就是 at 规则，另一种是 qualified rule，也就是普通规则。

## at-rule
- @charset，提示css文件使用的字符编码方式，只在给出语法解析阶段前使用，不影响页面上的展示效果
- @import，用于引入一个CSS文件
- @media，能够对一些设备的类型进行一些判断
- @page，分页媒体访问网页时的表现设置
- ...

## 普通规则 - qualified rule
- 主要是由选择器和声明区块构成

## 声明：属性和值
- 声明部分是一个由“属性: 值”组成的序列。
- 以双中划线开头的属性被当作变量，与之配合的则是 var 函数
  ```css
  :root {
    --main-color: #06c;
    --accent-color: #006;
  }
  /* The rest of the CSS file */
  #foo h1 {
    color: var(--main-color);
  }
  ```
- 值的部分，这里的值可能是字符串、标识符。字符串，URL，整数，函数...
  - 函数，CSS 支持一批特定的计算型函数：calc()，max,clamp,toggle...
