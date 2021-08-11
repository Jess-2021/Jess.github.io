function recursion(n) {
  if (n === 1) return 1
  return n + recursion(n - 1)
}

function tailRecursion(n, res) {
  if (n === 1) return res + 1
  return tailRecursion(n - 1, res + n)
}
var res = tailRecursion(3, 0)

function tailCall(n) {
  let res = 0
  while(n !== 1) {
    res = res + n--
  }
  return res + 1
}

var aa = tailCall(5)
console.log(aa)