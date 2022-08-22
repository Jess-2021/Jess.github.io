# css模块化

## 1. 手写原生CSS

- 行内。样式不能复用，权重高，表现层结构层分离，不能缓存。
- 内嵌。
- 导入（@import）。需要等所有资源加载完才开始解析link，导致页面样式闪烁。
- 外部样式。

## 2. 预处理器Sass/less

- 解决了不支持变量，嵌套，父选择器问题，但打包结果和原生一致。

## 3. 后处理器PostCSS

- 通过 AST 解析 css，然后将分析结果进行处理。例如：stylelint 校验语法，自动添加浏览器前缀，编译css next语法。

## 4. css模块化

- 解决CSS命名问题，层级结构不清晰，common.js 庞大，代码难以复用。

- 实现：

  - BEM命名方法，块（block）、元素（element）、修饰符（modifier）
  ```css
  /* 块即是通常所说的 Web 应用开发中的组件或模块。每个块在逻辑上和功能上都是相互独立的。 */
  .block {
  }

  /* 元素是块中的组成部分。元素不能离开块来使用。BEM 不推荐在元素中嵌套其他元素。 */
  .block__element {
  }

  /* 修饰符用来定义块或元素的外观和行为。同样的块在应用不同的修饰符之后，会有不同的外观 */
  .block--modifier {
  }

  ```
  - css module。会在打包时候，自动将类名加上hash。解决命名冲突问题。但是难以与外部样式进行混用。

## 5. css in js

- 定义：不需要单独的css文件，所有的代码放在组件内部，实现css模块化。（个人不赞成👎）

## 总结：
![](https://user-gold-cdn.xitu.io/2019/12/30/16f5477372d2bee3?imageView2/0/w/1280/h/960/format/webp/ignore-error/1)

## css样式隔离
- BEM命名，被动。
- css module
```JS
import styles from './index.module.css';

function render() {
  return <div className={styles.main}>Hello world!</div>;
}
```
- styled components CSS in JS
- shadow DOM
