# 外观模式
- 兼容不同的规范。

- jQuery
```JS
element.on('click', function() {})

on() {
  // 处理了不同的浏览器兼容性
  if (navigator === 'chrome') {

  }
  if (navigator === 'firefox') {

  }
}
```