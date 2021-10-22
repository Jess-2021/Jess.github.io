# 对象常用api

## 枚举
- `for…in`. 遍历对象每一个可枚举属性，「包括原型链」

- `Object.keys()`. 只能遍历「自身」上的可枚举属性
- `Object.values()`，返回对象自身可枚举的值

- `Object.getOwnPropertyNames()`. 遍历自身所有的属性，包括「可枚举，不可枚举」
- `Object.setPrototypeOf(obj, prototype)`，设置一个指定的对象的原型（[[prototype]]）到另一个对象或者null上。「原型链新增属性」

- `Object.entries()`.返回一个对象「自身」可枚举属性的键值对数组。
```JS
// 同数组解构赋值一起使用
let meals = {
  mealA: 'Breakfast',
  mealB: 'Lunch',
};

for (let [key, value] of Object.entries(meals)) {
  console.log(key + ':' + value);
}

// 转化为map对象
let greetingsMap = new Map(Object.entries(meals));
```
