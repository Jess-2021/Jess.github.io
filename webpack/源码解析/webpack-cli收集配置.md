# 入口webpack.js - 进入webpack-cli
- 找到webpack-cli或者webpack-common

## webpack-cli做了哪些事情？
- 引入yargs，对命令行进行配置。
- 分析命令行参数，对各个参数进行转换，组成编译配置项。
- 引用webpack，根据配置项实例化webpack，进行编译和构建。
- webpack-cli config命令
![](/image/f03bdb56afcb113f7b5c09bd19a70c4.png)

## 流程：
- 通过命令和配置，转化生成配置选项参数Options
- 最后，根据配置参数，实例化「webpack对象 - compiler」。然后执行构建过程。

