// 选择排序
// 原理：每次找最小值，然后放到排序数组的最开始位置
// 复杂度：表现最稳定的排序算法，都是O(n^2)
// 适用范围：数据规模越小越好，不占用额外的内存空间

function selectSort(arr) {
  let leng = arr.length, minIndex = 0
  for(let i = 0; i < leng; i++) {
    minIndex = i
    for(let j = i + 1; j < leng; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
  }
  return arr
}

console.log(selectSort([8,5,9,7,4,15,0,9,3]))