# 变化相关API实现原理

## vm.$watch

- Watcher一个中介，数据变化时通知watch，然后再去通知其他地方。
- 同时，$watch支持一个函数，会直接覆盖getter。
```JS
class Watcher {
  constructor(vm, expOrFn, cb, options) {
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn) // 获取到对象深层的值， exp：Jarar.name.firstName
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
  set() {
    const old = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, old)
  }
}
```
- immediate，在调用时候执行一次cb。
- 最后会返回一个unwatch，用来取消监听。所以产生个问题，所以添加了depIds来控制依赖的唯一性（set）。
- 由于Dep记录着哪些watcher需要改变，同时，watcher也记录着自己被哪些Dep通知（expOrFn为函数时，函数可能为多个响应性的值），所以是多对多的关系。
- deep，就是除了触发当前被监听数据依赖的逻辑外，还要把这个值在内的所有字子值都触发一次收集依赖。

<hr />

## vm.$set & vm.$delete

- 关于set和delete都是在Observer抛出的方法。
- 同时，分了Array，object的处理。
- target不能为Vue.js实例，或者在Vue.js实例的根数据对象。
- 在最后修改时都需要去触发变化通知。
```JS
const ob = target.__ob__
ob.dep.notify()
```