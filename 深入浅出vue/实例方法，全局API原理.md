# 实例方法，全局API实现原理
- Vue构造函数，分别调用了以下方法。并接收了一个Vue构造函数作为参数。
```JS
function Vue(option) {
  // ...
  initMixin(Vue)
  stateMixin(Vue)
  eventsMixin(Vue)
  lifecycleMixin(Vue)
  renderMixin(Vue)
}
export default Vue
```
- 作用：再Vue的原型上挂载方法和属性。
```JS
export function initMixin(Vue) {
  Vue.prototype._init = function (options) {
    // do something init
  }
}
```
## [数据相关的实例方法 - stateMixin](./变化监听相关api实现.md)

## 1. vm.$watch
## 2. vm.$set
## 3. vm.$delete

## 事件相关的实例方法 - eventsMixin

## 1. vm.$on
- 监听实例上的自定义事件。可以有`vm.$emit`触发，事件的回调函数会接受所有传入事件触发的额外参数。
- 实现：
  - 注册事件时，将回调函数收集起来，存到Vue初始化创建的`_event`属性，触发事件时，将事件依次调用。
## 2. vm.$off
- 移除自定义事件监听器。
- 实现：
  - 没有参数 - 移除所有事件的监听器。重置_event事件。
  - 传了事件 - 将数组遍历一次，每一项依次调用`vm.$off`。传入事件名，将`this._event`中的event重置为空。（移除时，会由后向前遍历，这样可以少遍历一位。）
  - 传了事件和回调 - 如果还有回调，则在`this._event`中取出回调函数中相同的那个函数，将其移除。
  ```JS
  // ...
  if (fn) { // 如果回调函数存在
    const cbs = vm._event[event]
    let cb
    let i = cbs.length
    while(i--) {
      cb = cbs[i]
      if (cb === fn || cb.fn === fn) { // 检查监听器和监听器fn属性是否和参数提供的一致。
        cbs.splice(i, 1)
        break
      }
    }
  }
  ```
## 3. vm.$once
- 监听一个自定义事件，只触发一次，在触发后移除监听器。
- 实现：定义事件触发后，会执行拦截 - 将监听器从事件上移除。
```JS
Vue.prototype.$once = function(event, fn) {
  const vm = this
  function on() {
    vm.$off(vm, on)
    fn.apply(vm, arguments)
  }
  on.fn = fn // 在移除监听器时，需要和列表里的监听器函数做对比，拦截器和用户提供的函数不相同。故将拦截器保存到拦截器的「fn属性」中，当遍历监听器列表时，会检查「监听器的fn和监听器」是否和用户的监听器函数一致。只有有一个相同，就说明找到了。
  vm.$on(event, on)
  return vm
}
```
## 4. vm.$emit
- 触发实例上的事件，附加参数会传给监听器回调。
- 实现：从vm.event里取出事件监听器回调列表，并一次执行。

## 生命周期相关的实例方法 - lifecycleMixin

## 1.vm.$forceUpdate
- 迫使vue实例重新渲染。只影响实例本身，和插入插槽内容的子组件。
- 实现：调用vue实例上的watcher的「update方法」。
```JS
if (vm._watcher) {
  vm._watcher.update()
}
```

## 2. vm.$destroy
- 完全销毁一个实例。
- 实现：有以下步骤：
  1. 清理当前组件和父组件的链接。vm.$children保存着所有的子组件信息。
  2. 销毁实例上所有的watcher，断掉所有依赖追踪。调用watcher上的teardown，将所有的依赖项Dep列表中，将自己移除。[（vm._watcher如何来）](./Object&Array变化监听.md)
  3. 销毁vue创建的watcher实例，还需要消会用户使用「vm.$watch」创建的watcher实例。（初始化创建的_watchers）
  4. 标志vue实例已经销毁，并解除指令的绑定。
  5. 触发destroyed钩子。
  6. 移除事件监听。vm.$off()
  ```JS
  vm._watcher.teardown()
  ```

## 3. vm.$nextTick - 消息队列
- 将回调延迟到下次DOM更新周期之后执行，如果没有提供回调且支持Promise返回一个Promise。
```JS
export function nextTick(cb, ctx) {
  let _resolve
  callbacks.push(() => {
    if (cb) {
      cb.call(ctx)
    } else {
      _resolve(ctx)
    }
  })
  // ...
  if (!cb && typeof Promise !== 'undefined') {
    return new Promise(resolve => _resolve = resolve)
  }
}
```
- vue中有一个「队列」，每当需要渲染时，会推送到这个队列，在下一次事件循环中让watcher（组件内的顶层watcher）触发渲染的流程。而当watcher收到两个通知时，并不需要真实DOM两次修改，只需要更新虚拟DOM，在最后做一次性的修改即可。
- 变化监测 -> 组件watcher -> 虚拟DOM -> diff -> 更改DOM

- 实现：将受到的watcher实例添加到队列中，缓存起来，在添加到队列时检查是否已经存在相同的watcher，如果不存在才将watcher实例添加到队列中。在下一次事件循环中，会将队列里的watcher依次触发，并清空队列。
  ![](/image/nexttick.png)
  - 关于「nextTick是微任务」。（发布订阅）
  ```JS
  microTimerFunc = () => {
    p.then(flushCallbacks) // flushCallbacks是依次执行列表里的所有依赖
  }
  ```
- 问题：微任务优先级太高，可能会出现问题，在特殊场合可以`强制使用宏任务`的方法。当useMacroTask为true时，则用`macroTimeFunc`注册事件
  - vue中优先使用setImmediate，再者messageChannel，setTimeout。
  - 微任务在Promise不支持时，也会降级为macroTimerFunc。

## 4. vm.$mount
- 手动挂载一个未挂载的实例。想让vue实例关联DOM元素，只有使用该方法。返回实例本身，可以「链式调用」。
- vue完整版和vue运行时区别，在于是否有编译器。主要差异也在vm.$mount方法表现形式。
  - 完整版的构建版本中，会检查template或者el选项是否已经转换成render渲染函数。如果没有立即进入编译阶段。转化为render后，在进入挂在和渲染流程。
  - 运行时版本，会默认实例上已经有渲染函数，如果不存在则设置一个，「为一个空节点的VNode」。

  ## 完整版的vm.$mount实现
  ### 1. 函数劫持。将vue原型上的$mount方法包裹在一个新的方法里，做函数增强。
  ```JS
  const mount = Vue.prototype.$mount
  Vue.prototype.$mount = function(el) {
    // do something

    return mount.call(this, el)
  }
  ```
  ### 2. 通过el获取DOM元素
  - el参数支持元素类型或者字符串类型选择器。如果获取不到创建一个空的div元素。
  ### 3. 编译器
  - 实例中是否存在渲染函数，不存在时，将模板编译成渲染函数，并设置到this.$option。
    ### - 如何通过template转化为render？
      1. 合并option。
      2. 检查缓存中是否有存在编译后的模板。
      3. 调用compile函数编译模板，转化为`with(this){ return _c... }`
      4. 调用new Function(code)即可。
  ## 只包含运行时版本的vm.$mount
  - 同样是找到挂载的元素，运行时会开启watcher，在数据变化后，渲染到指定的DOM元素中。
  ### 流程：
    1. 获取对应的挂载元素。
    2. 触发钩子函数。beforeMount
    3. 通过watcher监听到data里，或者watcher参数里值的变化，diff后，生成渲染函数，就是执行渲染流程。

## 全局API实现原理

## Vue.extend - 子类继承父类的相关属性选项。
- 实现：
  - 增加了缓存策略，在反复调用extend方法后，返回的是同一个结果。
  - 创建子类，并将他返回，还未有继承逻辑。
  - 新增原型链继承，并且为子类添加cid（每一个子类的唯一标识）。
  - 合并两个选项为一个新对象。
  - 初始化props，computed，将key代理到props中。
  - 将父类存在的属性依次复制到子类中，包括extend，mixin，use，component，directive，filter。同时，在子类上新增superOptions，extendOptions，sealedOptions。
  ```JS
  sub.prototype = Object.create(Super.prototype)
  sub.constructor = Sub
  sub.cid = cid++
  ```

## Vue.nextTick & Vue.set & Vue.delete
- 三个实现原理和之前一致。
- set，delete会触发视图更新。

## Vue.directive & Vue.filter & Vue.component
- 指令。需要对DOM进行底层操作。
- 实现：
  1. 方法接受两个参数「id」和「definition」。
  2. 如果definition不存在，则使用id从this.options中取出，并返回。
  3. 如果存在，说明是注册操作，将其绑定在this.options[type]上。

- 指令还需判断definition是否是函数
  1. 默认监听bind和update事件，并使用对象覆盖definition。
  2. 如果definition不是函数，说明是自定义指令，直接保存在this.options上。
- 组件需要添加definition.name属性。
  ```JS
  // 以指令为例
  if (!definition) {
    return this.options['directive'][id]
  } else {
    if (typeof definition === 'function') {
      definition = { bind: definition, update: definition }
    }
    this.options['directives'][id] = definition
    return definition
  }
  ```

## Vue.use
- 如果插件是一个对象，必须提供install方法，接受一个Vue构造函数作为参数。
- 如果是一个函数，会被作为install方法。
- 多次调用会只执行一次。
- 除了构造函数之外的参数会被传入plugin。（类似call）

## Vue.mixin
- 全局注册混入。会更改Vue.options会影响每一个实例。
- 实现：将用户传入的对象与Vue自身的options属性合在一起。

## Vue.compile
- 只在完整版有。编译模板字符串并返回包含渲染函数的对象。