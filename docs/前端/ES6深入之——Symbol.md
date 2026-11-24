---
description: "一、什么是symbolsymbol 是一种基本数据类型，用来表示一个独一无二的值二、语法let a =  Symbol([description])这里的description这是一个描述，相当于注释，不起任何作用。所以，即便description一样，其值还是不一样：let a = Symb..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/cr2gvg1wmzp35g90"
updated: "2023-03-08T03:48:13.000Z"
---

# ES6深入之——Symbol

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/cr2gvg1wmzp35g90)

<details class="toc-details">
<summary>本页结构（14 个小节）</summary>

- 一、什么是symbol
- 二、语法
- 代码示例
- 三、方法
- 1、Symbol.for(key)
- 2、Symbol.keyFor()
- 注意事项
- 1、for...in无法遍历
- 2、类型转换
- 使用场景

</details>

## 一、什么是symbol

symbol 是一种**基本数据类型**，用来表示**一个独一无二的值**

## 二、语法

## 代码示例

```js
let a =  Symbol([description])
```

这里的`description`这是一个描述，相当于注释，不起任何作用。

所以，即便`description`一样，其值还是不一样：

```js
let a = Symbol('haha');
let b = Symbol('haha');
console.log(a===b);// false

// typeof
typeof Symbol() === 'symbol' // true
```

## 三、方法

### 1、Symbol.for(key)

使用给定的 `key` 搜索现有的 `symbol`，如果找到则返回该 `symbol`。否则将使用给定的 `key` 在全局 `symbol` 注册表中创建一个新的 `symbol`。

> 说白了，如果有就返回，如果没有就创建

```js
let c = Symbol.for('yaya');// 刚开始没有就创建一个Symbol并返回
let d = Symbol.for('yaya'); // 已经有了，直接返回
console.log(d===c);
```

### 2、Symbol.keyFor()

由于`Symbol()`写法没有登记机制，所以每次调用都会返回一个不同的值。`Symbol.keyFor()`方法返回一个已登记的 Symbol 类型值的`key`。

```js
let c = Symbol.for('yaya')
let e = Symbol.keyFor(c);
console.log(e); // yaya

let f = Symbol('sasa');
console.log(Symbol.keyFor(f)); // undefined
```

## 注意事项

### 1、for...in无法遍历

```js
let animal = {
  [a]: 'dog',
  [b]: 'cat',
  c: '啊嘿嘿吧'
}
for (const key in animal) {
  console.log('dadada',key);// c
}
```

可以遍历的方法

-   `Object.getOwnPropertySymbols()` ：返回对象中只包含`symbol`类型`key`的数组
-   `Reflect.ownKeys()` ：返回对象中所有类型`key`的数组（包含`symbol`）

### 2、类型转换

symbol只能转化为**布尔值和字符串**

```js

console.log(Boolean(a)); // true
console.log(String(a)); // Symbol(haha)
console.log(Number(a)); // 报错 

```

## 使用场景

### 1、作为属性名

作为属性名，需要使用`[]`进行包裹：

```js
let a = Symbol('haha');
let b = Symbol('haha');
let animal = {
  [a]: 'dog',
  [b]: 'cat'
}
console.log(animal[a]); // dog
console.log(animal.a); // 字符串a undefined
console.log(animal[b]); // cat
```

### 2、防止污染三方插件

在企业开发中如果需要对一些第三方的插件、框架进行自定义的时候，可能会因为添加了同名的属性或者方法, 将框架中原有的属性或者方法覆盖掉，为了避免这种情况的发生, **框架的作者或者我们**就可以使用Symbol作为属性或者方法的名称；

### 3、消除魔术字符串

魔术字符串：在代码之中多次出现、与代码形成强耦合的某一个具体的字符串或者数值。

**风格良好的代码，应该尽量消除魔术字符串**，改由含义清晰的变量代替。

```js
const gender = {
   //这样就说明man就是一个独一无二的值，不用再man:'man'   
    man: Symbol(),
    woman: Symbol(),
}
function isMan(gender) {
    switch (gender) {
        case gender.man:
            console.log('男性');
            break;
        case gender.woman:
            console.log('女性');
            break
    }
}
isMan(gender.man)  //男性

```

### 4、为对象定义非私有的，但又只希望在内部使用的方法

由于以 `Symbol` 值作为键名，不会被常规方法遍历得到。我们可以利用这个特性，为对象定义一些非私有的、但又希望只用于内部的方法。

> 注意：symbol并不能实现真正的私有变量的效果，只是不能通过常规的遍历方法拿到symbol类型的属性而已
