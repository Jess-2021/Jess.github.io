// 1. 深度优先
// 当前层没有循环完，就进入到下一层的递归层
let visited = []
function dfs(node, visited) {
  visited.push(node)
  for(next in node.children) {
    if (!visited.some(item => item === next)) {
      dfs(node.children, visited)
    }
  }
}


var obj = {
  val: 0,
  children: [{
    val: 1,
    children:[
      {
        val: 2,
        children: [{
          val: 3
        }]
      },
      {
        val: 5,
        children: [{
          val: 7
        }]
      },
    ]
  }]
}

function dfs(node, visited = []) {
  visited.push(node.val)
  if (!node.children) return
  for(var i = 0; i <= node.children.length; i++) {
    let current = node.children[i]
    if (!visited.some(item => item === current.val)) {
      dfs(current, visited)
    }
  }

  return visited
}

console.log(dfs(obj, []))

