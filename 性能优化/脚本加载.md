# script

## async defer 
共同点：均不阻塞DOM渲染

## defer
- 告诉浏览器`渲染进程`不要等待脚本。脚本会在下载进程里下载，然后等DOM解析完成后，即`DOMContentLoaded`之前再执行脚本。
- 能保证脚本的执行顺序。
- 模块脚本总是被延迟的。

## async
- 如果遇到async会推到延迟队列中去进行异步加载。
- 加载完成后，立即推到消息队列执行。

## 动态脚本
- 代码生成script标签。默认情况下是异步的。
- 也可以设置`async = false`来实现defer。
