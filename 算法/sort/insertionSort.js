// 插入排序
// 原理：从前到后逐步构建有序序列，对于未排序数据，在已排序中从`后向前扫描`，找到相应位置并插入。
// 复杂度：只需要用到O(1)的额外空间，最好O(n)，最坏O(n^2)，不稳定
function insertionSort(arr) {
  let length = arr.length, current, preIndex
  for(let i = 1; i < length; i++) {
    current = arr[i]
    preIndex = i - 1
    while(arr[preIndex] > current && preIndex >= 0) {
      arr[preIndex + 1] = arr[preIndex]
      preIndex--
    }
    arr[preIndex + 1] = current
  }

  return arr
}

console.log(insertionSort([8,5,9,7,4,15,0,9,3]))