//堆排序
// 时间；O(nlogn)
// 空间：O(1)
// 稳定，适合用在只需要前几位的排序，例如：取得第N个最大的元素
function heapSort(arr) {
  if (!arr.length) return
  let length = arr.length
  for(let i = length / 2 - 1; i >= 0; i--) {
    heapify(arr, length, i)
  }
  // 排列数组
  for(let i = length - 1; i >= 0; i--) {
    let temp = arr[0]
    arr[0] = arr[i]
    arr[i] = temp
    heapify(arr, i, 0)
  }
}
/**
 * @param {*} arr 数组
 * @param {*} length 数组剩下的长度
 * @param {*} i 新加进来的元素
 */
function heapify(arr, length, i) {
  let left = 2 * i + 1, right = 2 * i + 2
  let largest = i

  if (left < length && arr[left] > arr[largest]) largest = left
  if (right < length && arr[right] > arr[largest]) largest = right

  if (largest !== i) {
    let temp = arr[i]
    arr[i] = arr[largest]
    arr[largest] = temp
    heapify(arr, length, largest)
  }
}
let arr = [8,5,9,7,4,15,0,9,3]
heapSort(arr)
console.log(arr)
