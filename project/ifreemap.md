# 插件系统

## 架构

接口：将逻辑在特定时机插入特定位置
输入：将上下文信息高效传导给插件
输出：插件内部通过何种方式影响整套运行体系

接口：ifreemap 提供接口，new 新建实例，结束绘制时自动清除，或者调用clearTool
输入： 事件系统，影响 map 对象
输出：生命周期提供当前实例的 object