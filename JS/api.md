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

# JSON.stringify()
```ts
JSON.stringify(value[, replacer [, space]])
```

1. 对于 undefined、任意的函数，symbol 会有不同的返回结果
  - 作为对象属性值时 JSON.stringify() 跳过（忽略）
  - `数组元素值` 时，JSON.stringify() 将会将它们序列化为 null
  - 单独序列化时，会返回 undefined
2. 非数组对象的属性，不能保证特定的顺序
3. toJSON 函数返回什么就是什么
4. Date 会正确序列化
5. 数值 NaN，Infinity 都会当作 null
6. 包装对象会自动转换为原始值
  ```js
  JSON.stringify([new Number(1), new String("false"), new Boolean(false)]);
  // "[1,"false",false]"
  ```
7. 对于对象属性，其他类型的对象，包括 Map/Set/WeakMap/WeakSet，仅会序列化可枚举的属性。
8. 深拷贝时，循环引用会报错
9. symbol 为属性会直接忽略

## 第二个参数
每一个属性值都会执行一次该函数。
数组的值代表将被序列化成 JSON 字符串的属性名。

## 第三个参数
space 参数用来控制结果字符串里面的间距。
