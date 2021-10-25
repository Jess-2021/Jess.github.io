function divideConquer() {
  // 终止条件
  if (res < target) {
    return
  }

  // 分割问题
  data = prepareData(problem)
  subProblems = splitProblem(problem, data)

  // 处理子问题
  subresult1 = divideConquer(subProblems[0], p1)
  subresult2 = divideConquer(subProblems[1], p1)
  subresult3 = divideConquer(subProblems[2], p1)

  // 合成最后结果
  result = mergeResult(subresult1, ...subresult2, subresult3)

  // 处理当前层状态: 恢复等
}