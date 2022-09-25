# 数据结构时间复杂度
![](/image/331cf3b37282e9075d114e17253484e.png)

# 排序算法
![](/image/d11ffe290a89fab182d3c9a497a77d4.png)
# 二叉树

- 遍历：

  1. 前序。根左右
  2. 中序。左根右边。
  3. 后序。左右根。

# 排序算法
- 比较类排序，通过比较来决定元素间的相对次序，`时间复杂度不能突破O(nlogn)`。又称为非线性时间比较类排序。
- 非比较类排序，不通过比较来决定元素间的相对次序，`可以突破比较排序的下界O(n)，`也称为线性非比较类排序。
![](/image/5aac4595171bbccc83a35a5aadf4ccc.png)

![](/image/37961a353bb859bc6500ea4857715a0.png)
- 考察比较多的为nlog2n的算法「堆排序，快排，归并排序」

## 快排和归并

- 归并：先排序左右子数组，最后合并两个有序子数组。
- 快排：先选出左右两子数组，再对左右子数组进行排序。

## 堆排序 - 优先队列
- 大顶堆，小顶堆
- 堆插入O(logN)，最大最小值O(1)

- 数组依次建立小/大顶堆，依次取出堆顶元素，并删除。
- 不同于二叉排序树，保证子节点大于或者小于父节点。

```JS
let heap; // 堆数据结构
for(let i = 0; i < len; i++) {
  q.push(a[i])
}
for(let i = 0; i < len; i++) {
  res[i] = q.pop()
}

```

## 初级排序
- 选择排序：每次找最小值，然后放到排序数组的最开始位置
- 插入排序：从前到后逐步构建有序序列，对于未排序数据，在已排序中从`后向前扫描`，找到相应位置并插入。
- 冒泡排序：嵌套循环，`每次查看相邻的元素`，如果逆序，则交换。

# 思想
- 升维思想，空间换时间。

# 深度优先
当前层没有循环完，就进入到下一层的递归层
```js
function dfs(node, visited) {
  visited.push(node)
  for(n in node.children) {
    if (visited.some(a => a === n)) {
      dfs(n, visited)
    }
  }
}
```

# 广度优先
```js
function BFS(start) {
  let queue = [], visited = []
  queue.push([start])
  visited.push(start)

  while(queue.length) {
    node = queue.shift()
    visited.push(node)
    
    process(node)
    nodes = other_children(node)
    queue.push(Array.from(nodes))
  }
}
```