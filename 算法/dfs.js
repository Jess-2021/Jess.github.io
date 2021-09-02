// 1. 广度优先
let visited = []
function dfs(node, visited) {
  visited.push(node)
  for(next in node.children) {
    if (!visited.some(item => item === next)) {
      dfs(node.children, visited)
    }
  }
}

// 类似递归的写法
function dfs(node, visited) {
  if (visited.some(item => item === node)) return
  visited.push(node)

  for(next in node.children) {
    dfs(node.children, visited)
  }
}

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