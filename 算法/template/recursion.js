// 递归，同回溯

function recursion(level, param1, param2) {
  // 1. 递归终结者
  if (level > MAX_LEVEL) {
    // process result
    return
  }
  // 2. 这一层梦境要做的事
  process(level, data)

  // 3. 下到下一层
  self.recursion(level + 1, par1, par2)

  // 4. 清理这一层的结果
  reverseData()
}