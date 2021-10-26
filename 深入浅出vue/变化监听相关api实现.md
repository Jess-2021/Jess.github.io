# 变化相关API实现原理

## vm.$watch

- Watcher一个中介，数据变化时通知watch，然后再去通知其他地方。
- 同时，如果观测的是一个函数，会直接覆盖getter。并且，函数里的所有数据都会被watcher观察 - `traverse`。
- 支持观测函数和`computed`实现原理有很大关系 - 计算出结果。
```JS
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn) // 获取到对象深层的值， exp：Jarar.name.firstName+
    }
    this.vm = vm
    this.cb = cb
    this.value = this.get()
    this.deep = !!options.deep
  }
  get() {
    window.target = this
    let value = this.getter.call(this.vm, this.vm) // 将watcher添加到依赖收集里
    if(this.deep) {
      traverse(value) // 递归所有值触发收集依赖
    }
    window.target = undefined
    return value
  }

  update () {
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      this.run()
    } else {
      // ...
    }
  }

  run() {
    const old = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, old)
  }
}
```
- immediate，在调用时候执行一次cb。
- 在里面添加了`depIds`来控制依赖的唯一性（set），「由于watcher读取数据时候会进行依赖收集，如果不确保唯一性会一直触发依赖收集」，只有触发第一次getter时候，才会触发依赖收集。
- 流程：
  - `depId.add`记录watcher已经订阅了这个`DepID`。（订阅的watcher）
  - `deps.push(dep)`记录都订阅了哪些依赖回调。（订阅的依赖回调）
  - 触发`dep.addSub(this)`将自己订阅到Dep中。（getter里的订阅者）
- 最后，返回一个函数，取消观测。执行了`watcher.teardown()`。其实只是循环watcher的依赖列表，将他们都从依赖列表移除掉。
## PS - 针对函数的多个变量和多个依赖的多对多关系
- 由于Dep记录着哪些watcher需要改变，同时，watcher也记录着自己被哪些Dep通知（expOrFn为函数时，函数可能为多个响应性的值），所以是多对多的关系。
- deep，就是除了触发当前被监听数据依赖的逻辑外，还要把这个值在内的所有「子节点」都触发一次收集依赖。

<hr />

## vm.$set （vue3.0 已剔除）
- 如果是Array：
  - 如果key是一个有效的值。先设置length属性，然后调用splice方法设置到指定位置，会触发拦截器，转化为响应式。
  - 如果key存在，直接修改数组，会触发拦截器。
  - 如果是新增的值。会先判断是否是根数据（$data）。在判断是否是响应性数据，如果不是，直接赋值。如果是，则使用defineReactive转换成getter/setter。

## vm.$delete（vue3.0 已剔除）
- 删除属性后，向依赖发送通知。
- 同样，不能是根数据。
```JS
const ob = target.__ob__
ob.dep.notify()
```