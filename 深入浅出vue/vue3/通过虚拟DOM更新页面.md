# vDOM 如何被创建
通过 `mount` 的 `createVNode` 创建。

# patchElement

## 主要工作

- 更新节点自己的属性；通过 `patchFlag` 可以做到按需更新：
  - 如果标记了 `FULL_PROPS`，就直接调用 `patchProps` 。
  - 如果标记了其他属性，例如： `CLASS`，说明节点只有 `class` 属性是动态的，其他的属性都不需要进行判断和 DOM 操作。
  - 同时用到了位运算。对不同的 `PatchFlags` 进行判断。

  ```ts
  export const enum PatchFlags {
    // 动态文字内容
    TEXT = 1,

    // 动态 class
    CLASS = 1 << 1,

    // 动态样式
    STYLE = 1 << 2,

    // 动态 props
    PROPS = 1 << 3,

    // 有动态的key，也就是说props对象的key不是确定的
    FULL_PROPS = 1 << 4,

    // 合并事件
    HYDRATE_EVENTS = 1 << 5,

    // children 顺序确定的 fragment
    STABLE_FRAGMENT = 1 << 6
    ...
  }
  ```

  ```JS
  function patchElement(
    n1: VNode,
    n2: VNode,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    isSVG: boolean,
    slotScopeIds: string[] | null,
    optimized: boolean
  ) {
    ...
    if (patchFlag > 0) {
      if (patchFlag & PatchFlags.FULL_PROPS) {
        patchProps(...)
      } else {
        if (patchFlag & PatchFlags.CLASS) {
          hostPatchProp(...)
        } else if (patchFlag & PatchFlags.STYLE) {

        } else if {}
        <!-- ... -->
      }
    }
  }
  ```

- 更新子元素 - `patchChildren`

# patchChildren
双端的预先判断 + 最长递增子序列算法

## 分类
文本，数组，空；同时，新老子元素分别是这三种状态的一个

- 如果新旧一方有空元素或者文本元素，则直接 `unmount` 或者执行 `hostSetElementText`;
- 如果两边都是数组，需要判断出可以复用的 DOM 元素，从而更新一下属性，最大化减少 DOM 的操作，这个任务交给 `patchKeyedChildren` 去完成；

## PS
- React15 中，这种场景的处理逻辑是先进行循环，使用单侧插入的算法；而 vue2 采用了 `snabb dom` 的 `双端对比` 的算法；

  - 筛选出一样的节点，表示不需要创建，只需要进行属性的更新，

  ```JS
  a b c d e f g h
  a b c d i f j g h

  (a b c d) e f (g h)
  (a b c d) i f j (g h)
  ```

## 最长递增子序列 - vue2、vue3区别
- vue3 中用到的是贪心 + 二分。需要对 `双端比较完` 的两个数组计算  diff，最终找到最短的操作路径。（`O(nlogn)）`之后再去对数组进行 patch 就完成了整个 diff 流程。
