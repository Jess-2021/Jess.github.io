# 传统的持续集成 vs 前端持续集成

## 传统
- 每日构建，集成所有人的工作成果，统一构建成可运行的版本
- 通过测试，保证系统基本功能可用。

## 前端
- 由于页面的单一性，同时测试成本高，形成了以下措施：

## 内容
- 预览环境，每次提交代码到仓库同时同步到预览环境；
- 通过规则校验，数据采集，代码扫描等，保证代码质量。

### 预览环境细节
- 申请机器和域名、部署和建立发布机制
- 预览环境带参数和版本号，解决为了提供特定版本的预览环境、跟服务端api的短期对接问题；

### 规则校验
- 页面结构扫描：通过无头浏览器，配合JS编写规则完成
- 运行时数据采集：Performance API采集性能数据，window.onerror采集JS错误
- 代码扫描

