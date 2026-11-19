---
description: "JavaScript 原有的表示“集合”的数据结构，主要是数组（Array）和对象（Object），ES6 又添加了Map和Set。这样就有了四种数据集合，用户还可以组合使用它们，定义自己的数据结构，比如数组的成员是Map，Map的成员是对象。这样就需要一种统一的接口机制，来处理所有不同的数据..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/rur8rw"
updated: "2021-01-12T13:58:00.000Z"
---

# ES6深入之——Iterator（待完善）

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/rur8rw)

<details class="toc-details">
<summary>本页结构（7 个小节）</summary>

- Iterator的实质
- 说通俗点
- 例如
- 代码示例
- 遍历器对象的 return()，throw()
- for...of
- 参考文章

</details>

JavaScript 原有的表示“集合”的数据结构，主要是数组（`Array`）和对象（`Object`），ES6 又添加了`Map`和`Set`。这样就有了四种数据集合，用户还可以组合使用它们，定义自己的数据结构，比如数组的成员是`Map`，`Map`的成员是对象。这样就需要一种统一的接口机制，来处理所有不同的数据结构。

### Iterator的实质

Iterator 的遍历过程是这样的。

（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

（2）第一次调用指针对象的 `next` 方法，可以将指针指向数据结构的第一个成员。

（3）第二次调用指针对象的 `next` 方法，指针就指向数据结构的第二个成员。

（4）不断调用指针对象的 `next` 方法，直到它指向数据结构的结束位置。

每一次调用 `next` 方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含 `value` 和 `done` 两个属性的对象。其中， `value` 属性是当前成员的值(遍历结束为 `undefined` )， `done` 属性是一个布尔值，表示遍历是否结束。

### 说通俗点

ES6 规定，默认的 Iterator 接口部署在数据结构（比如数组实例，Map实例，Set实例）的 `Symbol.iterator` 属性，或者说，一个数据结构只要具有 `Symbol.iterator` 属性，就可以认为是“可遍历的”（iterable）。 `Symbol.iterator` 属性本身是一个函数，就是当前数据结构默认的遍历器生成函数。执行这个函数，就会返回一个遍历器，然后就可以调用遍历器的 `next` 方法

### 例如

#### 数组

## 代码示例

```js
let arr = ['foo', 'bar'];
let iter = arr[Symbol.iterator](); // 迭代器

console.log(iter.next());//{done:false,value:'foo'}
console.log(iter.next());//{done:false,value:'bar'}
console.log(iter.next());//{done:true,value:undefined}
```

#### Map

```js
const map = new Map([
  [1, 4],
  [3, 5],
  [6, 9],
]);
console.log(map[Symbol.iterator]);// 遍历器生成器
let mapIter = map[Symbol.iterator]();// 遍历器
console.log(mapIter.next()); // {value: Array(2), done: false}
console.log(mapIter.next()); // {value: Array(2), done: false}
console.log(mapIter.next()); // {value: Array(2), done: false}
console.log(mapIter.next()); // {value: undefined, done: true}
```

### 遍历器对象的 return()，throw()

#### return()

遍历器对象除了具有 `next()` 方法，还可以具有 `return()` 方法和 `throw()` 方法。如果你自己写遍历器对象生成函数，那么 `next()` 方法是必须部署的， `return()` 方法和 `throw()` 方法是否部署是可选的。

`return()` 方法的使用场合是，如果for...of循环提前退出（通常是因为出错，或者有 `break` 语句），就会调用 `return()` 方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署 `return()` 方法。

#### throw()

`throw()`方法主要是配合 Generator 函数使用，一般的遍历器对象用不到这个方法。请参阅阮一峰《Generator 函数》一章。

### for...of

ES6 借鉴 C++、Java、C# 和 Python 语言，引入了`for...of`循环，作为遍历所有数据结构的统一的方法。

一个数据结构只要部署了`Symbol.iterator`属性，就被视为具有 iterator 接口，就可以用`for...of`循环遍历它的成员。也就是说，`for...of`循环内部调用的是数据结构的`Symbol.iterator`方法。

`for...of`循环可以使用的范围包括数组、Set 和 Map 结构、某些类似数组的对象（比如`arguments`对象、DOM NodeList 对象）、后文的 Generator 对象，以及字符串。

### 参考文章

1.  [Iterator 和 for...of 循环](https://es6.ruanyifeng.com/#docs/iterator)
