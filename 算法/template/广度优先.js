function bfs(start) {
  let queue = [], visited = []
  queue.push(start)
  visited.push(start.val)

  while(queue.length) {
    let pre = queue.shift()
    visited.push(pre.val)

    if (!pre.children) continue
    for(node in pre.children) {
      queue.push(node)
    }

    // 处理pre的相关内容
  }
  console.log(visited)
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
function bfs(node) {
  let queue = [], visited = []
  queue.push(node)

  while(queue.length) {
    let pre = queue.shift()
    visited.push(pre.val)

    if (!pre.children) continue
    for(let current of pre.children) {
      queue.push(current)
    }
  }

  console.log(visited)
}
bfs(obj)
// [ 0, 1, 2, 5, 3, 7 ]