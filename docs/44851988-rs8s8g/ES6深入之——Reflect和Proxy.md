---
description: "一、Reflect一、什么是ReflectReflect 是一个内置对象，提供了一系列操作对象的方法，这些方法都是静态的（类似 Math），使用 Reflect 的方法可以做一些对象的基本操作。Reflect 反射，反射是在程序运行中获取和动态操作自身内容的一项技术。其实对于 JavaScri..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ouwptngyatax9u3s"
updated: "2023-05-16T06:03:29.000Z"
---

# ES6深入之——Reflect和Proxy

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ouwptngyatax9u3s)

::: info 本页结构
- 一、Reflect
- 一、什么是Reflect
- 二、方法
- 1、apply()
- 代码示例
- 2、construct()
- 3、defineProperty()
- 4、deleteProperty()
- 5、get()
- 6、getOwnPropertyDescriptor()【不常用】
:::

## 一、Reflect

## 一、什么是Reflect

Reflect 是一个**内置对象**，**提供了一系列操作对象的方法**，这些方法都是静态的（**类似 Math**），使用 Reflect 的方法可以做一些对象的基本操作。

**Reflect 反射**，反射是在程序运行中获取和动态操作自身内容的一项技术。其实对于 JavaScript 来说在出现 Reflect 之前就已经有反射的能力了，我们可以使用 `Object.keys()` 获取对象属性，可以使用 `Object.defineProperty` 定义属性，这些实际上都是反射的能力。既然已经可以实现反射功能，那为什么还需要有 `Reflect` 呢？

**答案是：更优雅~**

## 二、方法

### 1、apply()

语法，

## 代码示例

```js
/**
 * @parames target: 目标函数（必选）
 * @parames thisArgument: 目标函数中this的指向（可选）
 * @parames argumentsList: target参数（数组）
 *  返回值：函数target的执行结果
 * */
Reflect.apply(target, thisArgument, argumentsList)
```

相当于`Function.prototype.apply()`，也就是常见的`apply()` ，比如

```js
let hobby = Symbol('hobby')
let obj = {
  name: 'zhang shuaifeng',
  age: 13,
  work: 'font-end-engineer',
  [hobby]: ['reading', 'music']
}

function greeting(name) { 
  console.log(this.name, this.work);
  this.name = name
}
// console.log(Reflect.ownKeys(obj))

Reflect.apply(greeting, obj, ['张帅峰']);

//相当于
// greeting.apply(obj,['张帅峰'])
console.log(obj);

```

### 2、construct()

该方法有点像 `new Func()`构造函数，语法：

```js

/**
 * @parames target: 目标构造函数（必选）
 * @parames argumentsList: target的参数（数组，可选）
 * @parames newTarget 作为新创建对象的原型对象的 constructor 属性，参考 new.target 操作符，默认值为 target。（可选）
 返回值：构造函数实例
 * */
Reflect.construct(target, argumentsList[, newTarget])

```

比如

```js
let date = Reflect.construct(Date, [Date.now()]);
// 相当于 new Date(Date.now())
console.log(date.getFullYear()); // 2023
```

### 3、defineProperty()

基本等同于 `Object.defineProperty()` 方法，唯一不同是返回 `Boolean`值，表示是否成功

```js
 /**
 * @parames target: 要添加属性的对象（必选），如果不是对象会报错
 * @parames prop: 属性名（必选）
 * @parames description :要定义或修改的属性的描述。一个对象，通常含有value属性表示prop的值（必选）,此外还有writable（默认false，表示不可被赋值运算符也就是“=”重新赋值）
 * 返回值：布尔值，表示属性是否被成功定义
 * 
 * */

Reflect.defineProperty(target, propertyKey, attributes)
```

比如

```js
let istrue = Reflect.defineProperty(obj, 'eat', { value: 'watermelon1'});
// 相当于Object.defineProperty(obj,eat,{ value: 'watermelon1'})
console.log(istrue); // true
```

### 4、deleteProperty()

删除属性，相当于操作符 `delete obj.xxx`

```js
 /**
 * @parames target: 目标对象（必选）
 * @parames propertyKey: 要删除的属性（必选）
 * 返回值：布尔值，表示是否删除成功
 * */
Reflect.deleteProperty(target, propertyKey)
```

比如

```js
 let dog = {
      name:'哈士奇',
      age:2,
      hobby:['拆家'],
      characteristic:['精力旺盛']
    }
     let isDeleted = Reflect.deleteProperty(dog,'cat'); // true
		 let isDeleted = Reflect.deleteProperty(dog,'age'); // true
     console.log(isDeleted); // true
```

### 5、get()

从一个对象中取属性值。就如同[属性访问器](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Property_Accessors) 语法，但却是通过函数调用来实现。

```js
/**
     * @parames target: 目标对象（必选）
     * @parames propertyKey: 要访问的属性（必选）
     * @parames receiver 如果target对象中指定了getter，receiver则为getter调用时的this值。（可选）
     * 返回值：属性的值
     * */
Reflect.get(target, propertyKey[, receiver])
```

比如

```js
// Object
var obj = { x: 1, y: 2 };
Reflect.get(obj, "x"); // 1

// Array
Reflect.get(["zero", "one"], 1); // "one"

// Proxy with a get handler
var x = {p: 1};
var obj = new Proxy(x, {
  get(t, k, r) { return k + "bar"; }
});
Reflect.get(obj, "foo"); // "foobar"

```

### 6、getOwnPropertyDescriptor()【不常用】

静态方法 **Reflect.getOwnPropertyDescriptor()** 与 [Object.getOwnPropertyDescriptor()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getOwnPropertyDescriptor) 方法相似。如果在对象中存在，则返回给定的属性的属性描述符。否则返回 [undefined](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/undefined)。

```js
Reflect.getOwnPropertyDescriptor({x: "hello"}, "x");
// {value: "hello", writable: true, enumerable: true, configurable: true}

Reflect.getOwnPropertyDescriptor({x: "hello"}, "y");
// undefined

Reflect.getOwnPropertyDescriptor([], "length");
// {value: 0, writable: true, enumerable: false, configurable: false}

```

### 7、getPrototypeOf()【不常用】

静态方法 **Reflect.getPrototypeOf()** 与 [Object.getPrototypeOf()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/getPrototypeOf) 方法几乎是一样的。都是返回指定对象的原型（即内部的 \[\[Prototype\]\] 属性的值）。例如：

```js
const object1 = {
  property1: 42
};

const proto1 = Reflect.getPrototypeOf(object1);

console.log(proto1);
// Expected output: Object {  }

console.log(Reflect.getPrototypeOf(proto1));
// Expected output: null

```

### 8、has()

判断某个对象上是否存在某个属性，和in操作符像

```js
    /**
     * @parames target: 目标对象（必选）
     * @parames propertyKey: 要判断的属性（必选）
     * 返回值：属性的值
     * */
    // Reflect.has(target, propertyKey)
```

比如

```js
    let hasAge = Reflect.has(dog,'age')
    let hasToString = Reflect.has(dog,'toString')
    console.log(hasAge); //true
    console.log(hasToString); //true,原型链上有
  // 相当于 console.log('age' in dog ); //true
```

### 9、isExtensible()

判断一个对象是否可扩展（即是否能够添加新的属性）。

```js
  /**
   * @parames target: 目标对象（必选）
   * 返回值：布尔值，表示是否可扩展
   * */
Reflect.isExtensible(target)
```

比如

```js
 let isExtend = Reflect.isExtensible(dog);
 console.log(isExtend); //true
```

### 10、preventExtensions()

阻止新属性添加到对象中

```js
/**
 * @parames target: 目标对象（必选）
 * 返回值：布尔值，目标对象是否成功被设置为不可扩展。
 * */
Reflect.preventExtensions(target)
```

比如

```js
let isPreventExtensions = Reflect.preventExtensions(dog);
console.log(isPreventExtensions); //true
let isExtend1 = Reflect.isExtensible(dog);
console.log(isExtend1); //false,阻止了，不可扩展
```

### 11、set()

在一个对象上设置一个属性

```js
 /**
   * @parames target: 目标对象（必选）
   * @parames propertyKey: 要设置的属性（必选）
   * @parames value: 属性值（必选）
   * @parames receiver: 如果遇到 setter，receiver则为setter调用时的this值。
   * 返回值：布尔值，是否成功设置属性
   * */
Reflect.set(target, propertyKey, value[, receiver])
```

例如

```js
 let isSeted = Reflect.set(dog,'play',['各种拆家'])
 console.log(isSeted); // true
 console.log(dog);

// Array
var arr = ["duck", "duck", "duck"];
Reflect.set(arr, 2, "goose"); // true
arr[2]; // "goose"

// It can truncate an array.
Reflect.set(arr, "length", 1); // true
arr; // ["duck"];

// With just one argument, propertyKey and value are "undefined".
var obj = {};
Reflect.set(obj); // true
Reflect.getOwnPropertyDescriptor(obj, "undefined");
// { value: undefined, writable: true, enumerable: true, configurable: true }
```

### 12、ownKeys()

返回一个由目标对象自身的属性键组成的数组，**包括Symbol属性**

```js
/**
 * @parames target: 目标对象（必选）
 * 返回值：由对象的属性名组成的数组
 * */
Reflect.ownKeys(target)
```

例如

```js
   let bark = Symbol('bark')
    let dog = {
      name:'哈士奇',
      age:2,
      hobby:['拆家'],
      characteristic:['精力旺盛'],
      [bark]: '汪汪~'
    }
    let keys = Reflect.ownKeys(dog);
    console.log(keys); //['name', 'age', 'hobby', 'characteristic', 'play', Symbol(bark)]
```

### 13、setPrototypeOf()

设置对象的原型（即内部的 `[[Prototype]]` 属性）为另一个对象或 `null`，如果操作成功返回 `true`，否则返回 `false`。

```js
/**
 * @parames target: 目标对象（必选）
 * @parames prototype: 新的原型对象
 * 返回值：布尔值，是否成功设置原型
 * */
Reflect.setPrototypeOf(target, prototype)
```

例如

```js
 let dog = {
      name:'哈士奇',
      age:2,
      hobby:['拆家'],
      characteristic:['精力旺盛'],
      [bark]: '汪汪~'
    }
let dogPrototype = {
      bark(){
        console.log('汪汪');
      },
      doing(){
        console.log('拆家中...')
      },
      isMale:false
    }
    let isSetProto = Reflect.setPrototypeOf(dog,dogPrototype);
    console.log(dog); // 下图
    dog.doing() // 拆家中
```

![image.png](/images/c0c81c89b288f266.png)

## 二、Proxy

## 一、什么是Proxy

## 三、Proxy和Reflet的结合（应用场景）

## 四、参考

1.  [JS反射机制及Reflect详解](https://www.cnblogs.com/Leophen/p/14838608.html#autoid-2-2-0)
2.  [JavaScript 中的 Reflect 反射](https://juejin.cn/post/7034751905125367822)
3.  [MDN官方解释](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/apply)​

​
