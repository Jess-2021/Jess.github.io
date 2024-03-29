
// 快速排序
// 原理：数组中挑出一个元素（pivot），将比pivot小的放到前面，反之放到后面，这时通过pivot分割开，递归地对前后两组数据进行排序；排序完就是排列完成的数组。
// 复杂度：
  // 时间：平均O(nlog2n)，坏O(n^2)，好O(nlog2n)；
  // 空间：O(n)
// 稳定
function quickSort(arr, startIdx, endIdx) {
  if (startIdx >= endIdx) return
  let pivot = partition(arr, startIdx, endIdx)
  quickSort(arr, startIdx, pivot-1)
  quickSort(arr, pivot + 1, endIdx)
}

function partition(list, start, end) {
  let counter = start, pivot = end
  for(let i = start; i < end; i++) {
    if (list[i] < list[pivot]) {
      let prev = list[counter]
      list[counter] = list[i]
      list[i] = prev
      counter++
    }
  }
  let prev = list[counter]
  list[counter] = list[pivot]
  list[pivot] = prev

  return counter
}

function quickSort(arr, startIdx, endIdx) {
  if (startIdx >= endIdx) return
  let pivot = partition(arr, startIdx, endIdx)
  quickSort(arr, startIdx, pivot - 1)
  quickSort(arr, pivot + 1, endIdx)
}

function partition(list, start, end) {
  let smallCounter = start, pivot = end
  for(let i = start; i < end; i++) {
    if (list[i] < list[pivot]) {
      let prev = list[smallCounter]
      list[smallCounter] = list[i]
      list[i] = prev
      smallCounter++
    }
  }
  let prev = list[smallCounter]
  list[smallCounter] = list[pivot]
  list[pivot] = prev

  return smallCounter
}

let arr = [8,5,9,7,4,15,0,9,3]
quickSort(arr, 0, 8)
console.log(arr)