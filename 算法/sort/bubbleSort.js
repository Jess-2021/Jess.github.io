// 冒泡排序

// 原理：嵌套循环，每次查看相邻元素，如果逆序，则交换
// 复杂度：优O(n),坏O(n^2)，空间O(1)，稳定
function bubbleSort(arr) {
  let length = arr.length
  for(let i = 0; i < length - 1; i++) {
    for(let j = 0; j < length - 1 - i; j++) { // - i 因为经过前几次循环，数组后面i位已经排好序了
      if (arr[j + 1] < arr[j]) {
        [arr[j + 1], arr[j]] = [arr[j], arr[j + 1]]
      }
    }
  }

  return arr
}

console.log(bubbleSort([8,5,9,7,4,15,0,9,3]))