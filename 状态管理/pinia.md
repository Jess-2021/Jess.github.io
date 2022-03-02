# 优势
- 由于Vuex的模块化的命名空间模块的限制，例如：模块 user 中的 mutation add 方法，我们需要使用`commit('user/add')`来触发，但`这种字符串类型的拼接功能，在 TypeScript4 之前的类型推导中就很难实现`。
- 通过composition API 和 Option API，使用组合 Store 方式更好地支持了TS类型推导。
- 不同于vuex的单一状态树结构，能通过composition定义不同的状态树。

# Pinna

## createPinna
```js
export function createPinia(): Pinia {
  const scope = effectScope(true)
  // 通过 effectScope 创建一个作用域对象，并且通过 ref 创建了响应式的数据对象 state
  const state = scope.run(() => ref<Record<string, StateTree>>({}))!
  // 项目中用到的 state 都会挂载到 Pinia 这个响应式对象内部
  const pinia: Pinia = markRaw({
    install(app: App) {
      setActivePinia(pinia)
      if (!isVue2) {
        ...
        app.provide(piniaSymbol, pinia)
        app.config.globalProperties.$pinia = pinia
        ...
      }
    }
  })
}
```
## defineStore
```JS
export function defineStore(){
  // 通过 useStore 方法去定义 store，并且每个 store 都会标记唯一的 ID
  function useStore(pinia?: Pinia | null, hot?: StoreGeneric): StoreGeneric {
    const currentInstance = getCurrentInstance()
    // 这里 inject 的数据就是 createPinia 函数中 install 方法提供的。
    pinna = (currentInstance && inject(piniaSymbol))
    // 项目中可能会存在很多 Pinia 的实例，设置 activePinia 就是设置当前活跃的 Pinia 实例。（与vue中的componentInstance相似）
    pinia = activePinia!
    // 最后通过 createSetupStore 或者 createOptionsStore 创建组件。
    if (isSetupStore) {
      createSetupStore(id, setup, options, pinia)
    } else {
      createOptionsStore(id, options as any, pinia)
    }
    // 通过 pinia._s 缓存创建后的 store，_s 就是在 createPinia 的时候创建的一个 Map 对象，防止 store 多次重复创建
    const store: StoreGeneric = pinia._s.get(id)!
    ...
  }
}
```
## createOptionsStore 中也是通过createSetupStore创建
## createSetupStore
```JS
// $patch 函数可以实现数据的更新
function $patch(
  partialStateOrMutator:
    | _DeepPartial<UnwrapRef<S>>
    | ((state: UnwrapRef<S>) => void)
): void {
  if (typeof partialStateOrMutator === 'function') {
    // 如果传递的参数 partialStateOrMutator 是函数，则直接执行
    partialStateOrMutator(pinia.state.value[$id] as UnwrapRef<S>)
    ...
  } else {
    // 否则就通过 mergeReactiveObjects 方法合并到 state 中，最后生成 subscriptionMutation 对象
  }
  ... 
  // 通过 triggerSubscriptions 方法触发数据的更新。
  triggerSubscriptions(
    subscriptions,
    subscriptionMutation,
    pinia.state.value[$id] as UnwrapRef<S>
  )
}

// partialStore 对象去存储 ID、$patch、Pinia 实例
function partialStore() {
}
// 再调用 reactive 函数把 partialStore 包裹成响应式对象
const store: Store<Id, S, G, A> = reactive(
  assign({}， partialStore )
)
// 通过 pinia._s.set 的方法实现 store 的挂载。
pinia._s.set($id, store)
```