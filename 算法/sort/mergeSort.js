// 归并排序
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

function mergeSort(arr, left, right) {
  if (left >= right) return
  let mid = (right + left) >> 1
  mergeSort(arr, left, mid)
  mergeSort(arr, mid + 1, right)
  merge(arr, left, right, mid)
}

function merge(arr, left, right, mid) {
  let temp = [], i = left, j = mid + 1, idx = 0
  // 两数组合并成一个时
  while(i <= mid && j <= right) {
    temp[idx++] = arr[i] > arr[j] ? arr[j++] : arr[i++]
  }
  while(i <= mid) temp[idx++] = arr[i++]
  while(j <= mid) temp[idx++] = arr[j++]

  for(let k = 0; k < temp.length; k++) {
    arr[left + k] = temp[k]
  }
}

let arr = [2,5,2,8,9,4]
mergeSort(arr, 0, 5)
console.log(arr)
