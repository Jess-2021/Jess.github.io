# vm.$watch
- 一句话原理：需要观察数据并收集`watcher`，当数据发生变化时，通知到watcher，并将新旧值传递给用户定义的回调函数。同时根据不同的options处理：sync，immediate，deep。

![](/image/e439e4df2c889600fd0bd43fc17d28a.png)
- Watcher一个中介，数据变化时通知watch，然后再去通知其他地方。
- 同时，如果观测的是一个函数，会直接覆盖getter。并且，函数里的所有数据都会被watcher观察 - `traverse`。
- 需要处理三种watcher：user-watcher, compute-watcher, render-watcher
```JS
// vm.$watch
Vue.prototype.$watch = function(expOrFn, cb, options = {}) {
  const vm = this
  if (isPlainObject(cb)) {  // 如果cb是对象，当手动创建监听属性时
    return createWatcher(vm, expOrFn, cb, options)
  }
  options.user = true  // user-watcher的标志位，传入Watcher类中
  const watcher = new Watcher(vm, expOrFn, cb, options)  // 实例化user-watcher

  if (options.immediate) {  // 立即执行
    cb.call(vm, watcher.value)  // 以当前值立即执行一次回调函数
  }  // watcher.value为实例化后返回的值

  return function unwatchFn () {  // 返回一个函数，执行取消监听
    watcher.teardown()
  }
}


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

    if (typeof expOrFn === 'function') {  // 如果expOrFn是函数
      this.getter = expOrFn
    } else {
      this.getter = parsePath(expOrFn)  // 如果是字符串对象路径形式，返回闭包函数 => 返回对应字符串的值，例如：jess.name.firstName
    }

    this.value = this.get()  // 执行get
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
    } else if (this.sync) { // 如果有设置sync为true
      this.run() // 跳出nextTick队列，直接执行
    } else {
      queueWatcher(this)  // 否则加入队列，异步执行run()
    }
  }

  run() {
    const old = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, old)
  }
}
```
- 在里面添加了`depIds`来控制依赖的唯一性（set），「由于watcher读取数据时候会进行依赖收集，如果不确保唯一性会一直触发依赖收集」，只有触发第一次getter时候，才会触发依赖收集。
- 流程：
  - `depId.add`记录watcher已经订阅了这个`DepID`。（订阅的watcher）
  - `deps.push(dep)`记录都订阅了哪些依赖回调。（订阅的依赖回调）
  - 触发`dep.addSub(this)`将自己订阅到Dep中。（getter里的订阅者）

# PS - 针对函数的多个变量和多个依赖的多对多关系
- 由于Dep记录着哪些watcher需要改变，同时，watcher也记录着自己被哪些Dep通知（expOrFn为函数时，函数可能为多个响应性的值），所以是多对多的关系。

<hr />

# computed
```JS
function defineComputed(target, key) {
  ...
  Object.defineProperty(target, key, {
    enumerable: true,
    configurable: true,
    get: createComputedGetter(key),
    set: noop
  })
}

function createComputedGetter (key) {
  
return function () {  // 返回函数
    const watcher = this._computedWatchers && this._computedWatchers[key]
    // 原来this还可以这样用，得到key对应的computed-watcher
    
    if (watcher) {
      if (watcher.dirty) {  // 在实例化watcher时为true，表示需要计算
        watcher.evaluate()  // 进行计算属性的求值
      }
      if (Dep.target) {  // 当前的watcher，这里是页面渲染触发的这个方法，所以为render-watcher
        watcher.depend()  // 收集当前watcher
      }
      return watcher.value  // 返回求到的值或之前缓存的值
    }
  }
}
```
# vm.$set （vue3.0 已剔除）
- 如果是Array：
  - 如果key是一个有效的值。先设置length属性，然后调用splice方法设置到指定位置，会触发拦截器，转化为响应式。
  - 如果key存在，直接修改数组，会触发拦截器。
  - 如果是新增的值。会先判断是否是根数据（$data）。在判断是否是响应性数据，如果不是，直接赋值。如果是，则使用defineReactive转换成getter/setter。

# vm.$delete（vue3.0 已剔除）
- 删除属性后，向依赖发送通知。
- 同样，不能是根数据。
```JS
const ob = target.__ob__
ob.dep.notify()
```