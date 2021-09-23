function heapSort(arr) {
  if (arr.length === 0) return
  let length = arr.length
  for(let i = length / 2 - 1; i >= 0; i--) {
    heapify(arr, length, i)
  }
  for(let i = length - 1; i >= 0; i--) {
    let temp = arr[0]; arr[0] = arr[i]; arr[i] = temp
    heapify(arr, i, 0)
  }
}

function heapify(array, length, i) {
  let left = 2 * i + 1, right = 2 * i + 2
  let largest = i

  if(left < length && array[left] > array[largest]) largest = left
  if (right < length && array[right] > array[largest]) largest = right

  if (largest !== i) {
    let temp = array[i]; array[i] = array[largest]; array[largest] = temp
    heapify(array, length, largest)
  }
}

let arr = [21,5,2,8,9,4]
heapSort(arr)
console.log(arr)