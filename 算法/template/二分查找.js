function halfSearch() {
  let left = right = 0, length = array.length - 1

  while(left <= right) {
    mid = left + right / 2
    if (array[mid] === target) {
      // break or return
    } else if (array[mid] < target) {
      left = mid + 1
    } else {
      right = mid - 1
    }
  }
}
