# Object 的变化监听

## 1. 变化检测
  - 有两种形式，分别是「推」、「拉」。其中pull，是通过知道数据发生变化了，会发送一个信号给框架，然后框架通过暴力对比来找出需要重新渲染的节点。例如：Angular的脏检查。
  - Vue是通过push的形式，在变量访问到时记录对应的节点（window.target）。可以进行颗粒度更细的更新。（意味着需要更多的内存）

## 2. 如何追踪变化：

  - 通过Object.defineProperty上添加属性改变时和访问时的钩子。在getter中收集相应的依赖，收集到的也就是「Dep」。当属性改变时在setter对所有收集到的依赖循环进行相应的操作。

  - 依赖其实有很多，模板，watch。。。

  - vm.$watch，在创建一个watch时，会以watcher的身份调用一次值，这时会调用getter，同时，watcher也会被收集到。

  - 对于对象，需要对所有的属性「data」，进行设置getter和setter，「class Observer」会对所有的属性转化为getter/setter形式，这时就生成我们说的「响应式对象」。

  - 缺陷：监听只能监听到对象属性的访问和修改。监听不了对象中新属性的新增和删除。

## 3. 如何收集依赖：
  - 通过getter收集依赖，在setter触发依赖。
  - 在data的数据里会保存一份「dep」，通过getter将收集到的依赖存放到dep里。setter触发时通知收集到的依赖，做相应的变化。

  - 问题：收集到的依赖可能会有多种类型，template，watcher等。不好通知。「可以通过设置一个中介，在平时只通知到一个，中介再通知其他地方」
```JS
export default class Dep {
  constructor() {
    this.subs = []
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  removeSub(sub) {
    remove(this.subs, sub)
  }

  depend() {
    if (window.target) {
      this.addSub(window.target) // window.target就是watcher！
    }
  }

  notify() {
    const subs = this.subs.slice()
    for(...) {
      sub[i].update()
    }
  }
}
// ...
function defineReactive(data, key, val) {
  if (typeof val === 'object') {
    new Observer(val)
  }
  let dep = new Dep()
  Object.defineProperty(data, key, {
    // ...
    get() {
      // ...
      dep.depend() // 收集
    },
    set() {
      // ...
      dep.notify() // 触发
    }
  })
}
```
## 4. 依赖是谁? - watcher
  - 数据变化了，通过watcher，watcher再执行收集到依赖中的的回调函数。「其实也就是一个依赖，所以将watcher加入Dep里就可以了」。
  - 实现：将一个外部的对象调用一下data的数据，就能触发收集，最后再清除。（类似寄生继承）
  - 初始化时包括了对vm._watcher的处理。实例上有一个watcher，会监听这个组件中的所有状态，组件里用到的所有状态的依赖列表都会收集到vm._watcher中。状态变化时，会通知vm._watcher,然后它vW在调用DOM进行重新渲染。
```js
vm.$watch('a.b.c', function(newVal, oldVal) {
  // 在a.b.c变化时触发后面的回调，只需要将watcher实例收集到a.b.c属性的Dep即可
})
// ...
export default class Watcher {
  constructor(vm, expOrFn, cb) {
    this.vm = vm
    this.getter = parsePath(expOrFn) // 可以读取到getter，拿到后读取触发收集依赖
    this.cb = cb
    this.value = this.get()
  }
  get() {
    window.target = this
    let value = this.getter.call(this.vm, this.vm)
    window.target = undefined
    return value
  }

  update() { // 当值发生变化时，就让依赖列表「所有依赖」循环触发该方法
    const oldValue = this.value
    this.value = this.get()
    this.cb.call(this.vm, this.value, oldValue) // 执行回调函数
  }
}
```

## 5. Observer类 - 将data数据内所有属性转化为响应式模式
- 一旦数据发生了变化，会通知所有的依赖。
```JS
export default Observer {
  constructor() {
    this.value = value

    if (!Array.isArray(value)) {
      this.walk(value)
    } else {
      // 如果是数组，重写改变数组的实例方法
      value.__proto__ = arrayMethods
    }
  }

  walk(obj) {
    const key = Object.keys(obj)
    for(let i = 0; i<keys.length; i++) {
      defineReactive(obj, key[i], obj[keys[i]])
    }
  }
}
```

# Array 的变化监听

## 1. 变化监听：

  - 「改变数组大部分是通过push等方法去改变原数组」。但在es6前没办法去对JS进行元编程。从而采用了对数组原型上的方法进行重写覆盖。
  - 还是用了Object.defineProperty的方法进行绑定监听。
  - 通过对数组里改变原数组的方法「push、pop、shift、unshift、splice、sort、reserve」进行重写。
  ```JS
  const arrayMethodsProto = Object.create(Array.prototype)
  ;[
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'splice',
    'reserve',
  ].forEach(function(method) {
    // 缓存原始方法
    const original = arrayProto[method]
    Object.defineProperty(arrayMethodsProto, method, { // 拦截调用原型上的方法
      value: function mutator(...args) {
        const ob = this.__ob__
        return original.apply(this.args)
      },
      enumerable: false,
      writable: false,
      configurable: false,
    })
  })
  ```

## 2.  拦截器：
- 通过拦截器覆盖data数据里的响应式Array类型数据的原型。
```JS
if (Array.isArray(value)) {
  value.__proto__ = arrayMethods
}
```
- 同时，拦截时如果浏览器不兼容__proto__，则直接将方法「设置在被监听的数组」上。

## 3. 如何收集依赖？
- getter里收集依赖，在拦截器里触发依赖。
- 收集的位置，同样在getter中进行收集，在拦截器中触发依赖。同时，又有拦截器，所以将依赖保存的位置，保存在「Observer的实例」上。之所以在getter里收集依赖，因为defineReactive中的val很可能是一个数组
  ```JS
  function defineReactive(data, key, value) {
    let childOb = observe(val) // 返回一个Observer实例，单例模式
    let dep = new Dep()
    Object.defineProperty(data, key {
      // ...
      get: function() {
        dep.depend()

        if (childOb) {
          childOb.dep.depend()  // 将dep绑定到childOb响应式对象里
        }
        return val
      },
      set: function(newVal) {
        if(val === newVal) return

        dep.notify() // 向依赖发送更新的消息
        val = newVal
      }
    })
  }
  ```
## 4. 拦截器中获取到observer实例 - __ob__
- 「因为Array拦截器是对原型的一种封装」，所以可以拦截器中访问到this（正在被操作的数组）。这就是Observer中的__ob__属性，可以用来标识改数组被转换成了响应式数据。

## 5. 向数组依赖发送通知
- 由于是实例方法，访问得到this。所以，在__ob__上拿到getter注入observer的dep即可。
```JS
const ob = this.__ob__
ob.dep.notify() // 向依赖发送通知
```
## 6. 如何监听到数组里的元素变化
  - 数组中新增的元素可能会有数组，所以需要对数组中每一项进行递归的observe响应式处理；
  - 如果是新增数组时，即「push、splice、unshift」都需要对新增的数组进行响应式处理
- 同时，对数组进行字面量操作的不能被监听到变化。
