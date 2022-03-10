// 计数排序
// 时间：O(n + k) k 为数组中最大的值
// 空间： O(k)
// 稳定，速度快于任何比较类排序算法，用在当最大值K不大并且序列集中
function countingSort(arr, maxValue) {
  let bucket = new Array(maxValue + 1);
  let sortedIndex = 0;
  let length = arr.length;
  let bucketLength = maxValue + 1;

  for (var i = 0; i < length; i++) {
    if (!bucket[arr[i]]) {
      bucket[arr[i]] = 0;
    }
    bucket[arr[i]]++;
  }

  for (var j = 0; j < bucketLength; j++) {
    while (bucket[j] > 0) {
      arr[sortedIndex++] = j;
      bucket[j]--;
    }
  }

  return arr;
}

let arr = [8,5,9,7,4,15,0,9,3]
countingSort(arr, 15)
console.log(arr)
