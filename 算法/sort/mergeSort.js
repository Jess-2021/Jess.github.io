// 归并排序
// 时间：稳定 O(nlogn)
// 空间：O(N)
// 稳定
function mergeSort(arr, left, right) {
  if (right <= left) return
  let mid = (right + left) >> 1
  mergeSort(arr, left, mid)
  mergeSort(arr, mid + 1, right)
  merge(arr, left, right, mid)
}

function merge(arr, left, right, mid) {
  let temp = []
  let k = 0, i = left, j = mid + 1
  while(i <= mid && j <= right) {
    temp[k++] = arr[i] <= arr[j] ? arr[i++] : arr[j++]
  }
  while(i <= mid) temp[k++] = arr[i++];
  while(j <= right) temp[k++] = arr[j++];
  // console.log(temp)
  for(let p = 0; p < temp.length; p++) {
    arr[left + p] = temp[p]
  }
}

let arr = [8,5,9,7,4,15,0,9,3]
mergeSort(arr, 0, arr.length - 1)
console.log(arr)
