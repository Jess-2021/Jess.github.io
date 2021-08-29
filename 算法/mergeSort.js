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
    if (temp.length === 6) console.log(temp, temp[p])
    arr[left + p] = temp[p]
  }
}

let arr = [2,5,2,8,9,4]
mergeSort(arr, 0, 5)
console.log(arr)
