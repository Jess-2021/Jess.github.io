function bfs(graph, start, end) {
  let queue = []
  queue.push(start)
  visited.push(start)

  while(queue.length) {
    let pre = queue.shift()
    visited.push(pre)

    if (!pre.children) continue
    for(node in pre.children) {
      queue.push(node)
    }

    // 处理pre的相关内容
  }
}