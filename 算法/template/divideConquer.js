// 分治
function divideConquer() {
  // 终止条件：最后节点已经没有问题了
  if (res < target) {
    return
  }

  // 处理当前层逻辑
  data = prepareData(problem)
  // 分割成多个问题
  subProblems = splitProblem(problem, data)

  // 下探一层处理子问题
  subresult1 = divideConquer(subProblems[0], p1)
  subresult2 = divideConquer(subProblems[1], p1)
  subresult3 = divideConquer(subProblems[2], p1)

  // 合成最后结果
  result = mergeResult(subresult1, ...subresult2, subresult3)

  // 处理当前层状态: 恢复等
}