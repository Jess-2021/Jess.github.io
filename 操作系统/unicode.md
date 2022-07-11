# 计算机之间达成字母喝数字的对应关系协议

- Unicode 会提供一个抽象字符列表 `字符集`，并为每个字符分配一个独一无二的 `码位` 标识符 `编码字符集` 。一般为2个字节。

# 相关术语

![](/image/311657531707_.pic.jpg)

## 1. 码位
- 用于组织，控制，表示文本数据的信息单元，是分配给到单个字符的一个数字。
- 例如： `U+0000`
- 范围：`U+0000 ~ U+10FFFF`（并非所有的码位都有关联字符）

## 2. Unicode平面
![](/image/301657530826_.pic.jpg)
- 从 `U+0000` 到 `U+nFFFF` 的连续码位。

- ### 分类
  - 基本多文种平面BMP - 平面0
    - 范围：`U+0000 ~ U+FFFF`
  - 星光平面。
    - 范围：`U+10000 ~ U+10FFFF`

## 3. 码元
- 计算机在内存层面上不会使用码位或抽象字符，需要一种物理方式来表现 `Unicode` 码位，即码元。本质是一个二进制序列。

## 4. 字符编码
- 将码位转化位码元。常见的有：UTF-8，UTF-16，UTF-32
- 怎么做：
  - BMP 会被编码为1个16位长的码元。
  - 星光平面会被编码位2个16位长的码元。

## 5. 代理对
- 对于那些2个16位长的码元所组成的序列的 `单个抽象字符` 的表示方式，首个值位高位代理码元，第二个是 `低位代理码元`。
- 例如：`U+1F600 （😀）`编码为` UTF-16`，使用的代理对是 `0xD83D 0xDE00` 。
- tip：大部分（99%）字符都是BMP，只需要一个码元就能表示。

## 6. 组合符号
- 字形，字位
- 是什么：一种在位置在前的 `基本字符` 上创建 `字位` 的字符包含重音符号，变音符号等的字符，一般不会独立使用。
- 问题：看似一个符号，其实必须使用 `两个码位` 来表示。


# JS里的Unicode

## String

- String类型是由 `0或者多个16位无符号` 的元素组成的有序序列的集合。通常，用于表示运行中的ECMAScript程序中的文本数据，这时，String中的每个元素都会被视为一个 `UTF-16` 的 `码元` 值。
- 问题：涉及到`length`的问题
```JS
const smile = '\uD83D\uDE00';
console.log(smile);        // => ' '
console.log(smile.length); // => 2
const letter = 'e\u0301';
console.log(letter);        // => 'é'
console.log(letter.length); // => 2
```

## 转义序列
- 为什么：👆（length和代理位问题，）
- 是什么：基于`码位数字` - 表示 - > `码元`。

### - 分类
- 十六进制转义序列。
  - 范围：`U+00` 到 `U+FF`
  - 优点： 短。
  - 格式： `\x<hex>`
- Unicode转义序列。
  - 怎么用：转整个BMP的码位。
  - 格式：`\u<hex>`
  - 范围：`U+0000 ~ U+FFFF`
- 码位转义序列。
  - 整个Unicode空间的转义，包括BMP + 星光平面
  - 范围：`U+0000 ~ U+10FFFF`
  - 格式：`\u{<hex>}`

![](/image/321657532563_.pic.jpg)

## 字符串比较
- `String.prototype.normalize` 正规化：转译成规范格式。（'c\u0327' 被替换为 'ç'）

## 字符串长度和定位问题
- 长度与代理对，目前原生没有高效的方式解决。
```js
const str = 'cat\u{1F639}';
console.log(str);        // => 'cat '
console.log(str.length); // => 5

// [...str]
console.log([...str]);        // => ['c', 'a', 't', ' ']
console.log([...str].length); // => 4
```
- `[...str].length` 解决。性能问题。
- 长度和组合符号
```JS
const drink = 'cafe\u0301';
console.log(drink);                    // => 'café'
console.log(drink.length);             // => 5
console.log(drink.normalize())         // => 'café'
console.log(drink.normalize().length); // => 4
```
- `str.codePointAt(idx)`，调用Unicode感知。返回的字符是一个星光码位。

## 正则
- `u标识`,Unicode感知。能正确处理星光平面的字符。
```JS
const smile = ' ';
const regex = /^.$/;
console.log(regex.test(smile)); // => false

const regex = /^.$/u;
console.log(regex.test(smile)); // => true
```

# 总结
- JS里的字符串，即是将字符串视为码元序列。字符串真正的样子。

# PS
- 字符发展历史：ASCII -> GBKxxx -> unicode -> UTF-8 -> UTF-16