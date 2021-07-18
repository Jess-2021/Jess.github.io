# Object 的变化监听

1. 变化检测

    - 有两种形式，分别是「推」、「拉」。其中pull，是通过知道数据发生变化了，会发送一个信号给框架，然后框架通过暴力对比来找出需要重新渲染的节点。例如：Angular的脏检查。
    - Vue是通过push的形式，在变量访问到时记录对应的节点（window.target）。可以进行颗粒度更细的更新。（意味着需要更多的内存）

2. 如何追踪变化：

    - 通过Object.defineProperty上添加属性改变时和访问时的钩子。在getter中收集相应的依赖，收集到的也就是「Dep」。当属性改变时在setter对所有收集到的依赖循环进行相应的操作。

    - 依赖其实有很多，模板，watch。。。

    - vm.$watch，在创建一个watch时，会以watcher的身份调用一次值，这时会调用getter，同时，watcher也会被收集到。

    - 对于对象，需要对所有的属性「data」，进行设置getter和setter，「class Observer」会对所有的属性转化为getter/setter形式，这时就生成我们说的「响应式对象」。

    - 缺陷：监听只能监听到对象属性的访问和修改。监听不了对象中新属性的新增和删除。

# Array 的变化监听

1. 变化监听：

   - 改变数组大部分是通过push等方法去改变原数组。但在es6前没办法去对JS进行元编程。从而采用了对数组原型上的方法进行重写覆盖。

   - 拦截器：通过对数组里改变原数组的方法「push、pop、shift、unshift、splice、sort、reserve」进行重写。
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
   - 同时，拦截时如果浏览器不兼容__proto__，则直接将方法设置在被监听的数组上，

2. 依赖收集

    - 收集的位置，同样在getter中进行收集，在拦截器中触发依赖。同时，又有拦截器，所以将依赖保存的位置，保存在Observer的实例上。之所以在getter里收集依赖，因为defineReactive中的val很可能是一个数组
    ```JS
    function defineReactive(data, key, value) {
      let childOb = observe(val) // 返回一个Observer实例，单例模式
      let dep = new Dep()
      Object.defineProperty(data, key {
        // ...
        get: function() {
          dep.depend()

          if (childOb) {
            childOb.dep.depend()
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
    - 拦截器中获取到observer实例，因为Array拦截器是对原型的一种封装，所以可以拦截器中访问到this（正在被操作的数组）。这就是Observer中的__ob__属性，可以用来标识改数组被转换成了响应式数据。
    - 监听数组中数组的变化。
      - 数组中新增的元素可能会有数组，所以需要对数组中每一项进行递归的observe响应式处理；
      - 如果是新增数组时，即「push、splice、unshift」都需要对新增的数组进行响应式处理
    - 同时，对数组进行字面量操作的不能被监听到变化。