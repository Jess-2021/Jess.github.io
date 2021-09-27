// 双层循环遍历所有不重复的情况
function doubleIteration(length) {
  for(let i = 0; i < length; i++) {
    for(let j = i + 1; j <= length; j++){
      console.log(i, j)
    }
  }
}
// doubleIteration(3)
/*
  0 1
  0 2
  0 3
  1 2
  1 3
  2 3
**/

// 两边往中间遍历
function closeIteration(length) {
  for(let i = 0, j = length; i <= j;) {
    if (i === j) return console.log(i) // 需要处理相等的情况
    console.log(i++, j--)
  }
}
closeIteration(6)
/**
  0 6
  1 5
  2 4
  3
 */

// 交换两数 - 斜杆交换
function exchangeNum(x, y) {
  let mid = x
  x = y
  y = mid
}

// 双指针

// 目的: 降低时间复杂度,例如:O(n^2) => O(n)
// ! 特点: 需要当前指针和遍历到的指针做判断或者其他操作
function doublePoint(arr) {
  let idx = 0
  for(let i = 0; i < arr.length; i++) {
    // 1. 需要当前指针和存储起来的指针做判断
    arr[idx]
    arr[i]
    // 2. 满足某种条件后idx双指针++
    idx++
  }
}