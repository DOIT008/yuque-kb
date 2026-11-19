---
description: "通过  var  声明的变量存在变量提升的特性：if (condition) {     var value = 1; } console.log(value);初学者可能会觉得只有 condition  为 true  的时候，才会创建 value ，如果 condition  为  fal..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/bih8gf"
updated: "2024-08-02T13:15:33.000Z"
---

# ES6深入之——let/const

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/bih8gf)

<details class="toc-details">
<summary>本页结构（13 个小节）</summary>

- 代码示例
- let 和 const
- 1.不会被提升
- 2.重复声明报错
- 3.不绑定全局作用域
- 块级作用域
- 4.再来说下 let 和 const 的区别：
- 临时死区
- 循环中的块级作用域
- 使用let解决问题

</details>

通过 `var`  声明的变量存在**变量提升**的特性：

## 代码示例

```js
if (condition) {
    var value = 1;
}
console.log(value);
```

初学者可能会觉得只有 `condition`  为 `true`  的时候，才会创建 `value` ，如果 `condition`  为 `false` ，结果应该是报错，然而因为变量提升的原因，代码相当于：

```js
var value;
if (condition) {
    value = 1;
}
console.log(value);
```

如果 `condition`  为 `false` ，结果会是 `undefined` 。

除此之外，在 `for`  循环中：

```js
for (var i = 0; i < 10; i++) {
    ...
}
console.log(i); // 10
```

即便循环已经结束了，我们依然可以访问 `i`  的值，也是因为变量提升的原因。

为了加强对变量生命周期的控制，ECMAScript 6 引入了块级作用域。

块级作用域存在于：

-   函数内部
-   块中(字符 `{`  和 `}`  之间的区域)

## let 和 const

块级声明用于声明在指定块的作用域之外无法访问的变量。

`let`  和 `const`  都是块级声明的一种。

我们来回顾下 `let`  和 `const`  的特点：

## 1.不会被提升

```js
if (false) {
    let value = 1;
}
console.log(value); // Uncaught ReferenceError: value is not defined
```

## 2.重复声明报错

```js
var value = 1;
let value = 2; // Uncaught SyntaxError: Identifier 'value' has already been declared
```

## 3.不绑定全局作用域

当在全局作用域中使用 `var`  声明的时候，会创建一个新的全局变量作为全局对象的属性。

```js
var value = 1;
console.log(window.value); // 1
```

然而 `let`  和 `const`  不会：

```js
let value = 1;
console.log(window.value); // undefined
```

## 块级作用域

```js
if(true){
  let a = 1
  const c = 19
  if(true){
    // 1
    let b = 3
    console.log(a)
  }
  // 3
  console.log(b)
}
// 2
console.log(a)
// if 里面有let(const也是一样)，所以在‘{}’形成了块级作用域（只有在块级作用域内部才能访问a），所以2处访问不了内部的a，但是1是在块级作用域内部，可以访问
// 同理 3处打印不了b，也是同样的原因
```

## 4.再来说下 let 和 const 的区别：

**const 用于声明常量**，其值一旦被设定不能再被修改，否则会报错。

值得一提的是：**const 声明不允许修改绑定（指针指向），但允许修改值。**这意味着当用 const 声明对象时：

```js
const data = {
    value: 1
}
// 没有问题m,修改了值
data.value = 2;
data.num = 3;
// 报错
data = {}; /data指向变了，所以会报错 Uncaught TypeError: Assignment to constant variable.
```

## 临时死区

`**let**`  **和** `**const**`  **声明的变量不会被提升到作用域顶部**，如果在声明之前访问这些变量，会导致报错；

```js
console.log(typeof value);// Cannot access 'value' before initialization
let value = 1;

```

这是因为 JavaScript 引擎在扫描代码发现变量声明时，要么将它们提升到作用域顶部(遇到 `var`  声明)，要么将声明放在 TDZ 中(遇到 `let`  和 `const`  声明)。访问 TDZ 中的变量会触发运行时错误。只有执行过变量声明语句后，变量才会从 TDZ 中移出，然后方可访问。

又比如：

![image.png](/images/4657c49b5db35a49.png)

上述画红框的部分就是死区，因为当访问的时候并没有创建`bar`变量，所以你根本也就访问不到，但如果使用`var`就不一样了，因为其有变量声明提升的功能，其声明会被提到最顶部。

```js
function foo(){
  console.log(bar);
  var bar = 12
}
// 实际执行
function foo(){
  var bar;
  console.log(bar); // undefined
  bar = 12
}
```

## 循环中的块级作用域

先看一个经典的问题：

```js
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
console.log(funcs[0])
// ƒ () {
//     console.log(i);
// }
funcs[0](); // 3
```

为什么?

因为 `for` 循环中的变量 `i` 是全局变量，当执行 `funcs[0]` 执行的时候，此时 `for` 循环已经执行完了，那么此时 `i=3` ，所以结果是 `3` ；

如果不使用 `let` ，我们能想到的办法就是使用闭包：

```js
var funcs = [];
for (var i = 0; i < 3; i++) {
    funcs[i] = (function(i){
        return function() {
            console.log(i);
        }
    }(i))
}
funcs[0](); // 0
```

这就是闭包的作用，哪里是闭包?下面的就是

```js
funcs[i] = (function(i){
        return function() {
            console.log(i);
        }
    }(i))
```

每执行一次循环，自知行函数就会执行一次，执行的结果是一个函数，但是内部的函数却保存着对外部函数内部变量i的引用，所以虽然外部函数执行完毕了，但其变量i依然存在于内部函数的作用域链中，所以，我们能访问到变量i。

## 使用let解决问题

```js
var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0
```

问题在于，上面讲了 `let`  不提升，不能重复声明，不能绑定全局作用域等等特性，可是为什么在这里就能正确打印出 `i`  值呢？

如果是不重复声明，在循环第二次的时候，又用 `let`  声明了 `i` ， 应该报错呀，就算因为某种原因，重复声明不报错，一遍一遍迭代， `i`  的值最终还是应该是 `3`  呀，还有人说 `for`  循环的：

设置循环变量的那部分是一个单独的作用域，就比如：

```js
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```

这个例子是对的，如果我们把 `let`  改成 `var`  呢？

```js
for (var i = 0; i < 3; i++) {
  var i = 'abc';
  console.log(i);
}
// abc
```

为什么结果就不一样了呢，如果有单独的作用域，结果应该是相同的呀……

如果要追究这个问题，就要抛弃掉之前所讲的这些特性！这是因为 `let`  声明在循环内部的行为是标准中专门定义的 [ECMAScript 规范第 13.7.4.7 节](http://www.ecma-international.org/ecma-262/6.0/#sec-for-statement-runtime-semantics-labelledevaluation)

我们会发现，在 `for`  循环中使用 `let`  和 `var` ，底层会使用不同的处理方式。

那么当使用 `let`  的时候底层到底是怎么做的呢？

简单的来说，就是在 `for (let i = 0; i < 3; i++)` 中，即圆括号之内建立一个隐藏的作用域，这就可以解释为什么:

```js
for (let i = 0; i < 3; i++) {
  let i = 'abc';
  console.log(i);
}
// abc
// abc
// abc
```

然后**每次迭代循环时都创建一个新变量，并以之前迭代中同名变量的值将其初始化**。这样对于下面这样一段代码

```js
var funcs = [];
for (let i = 0; i < 3; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // 0
```

相当于

```js
// 伪代码
(let i = 0) {
    funcs[0] = function() {
        console.log(i)
    };
}

(let i = 1) {
    funcs[1] = function() {
        console.log(i)
    };
}

(let i = 2) {
    funcs[2] = function() {
        console.log(i)
    };
};
```

当执行函数的时候，根据词法作用域就可以找到正确的值，其实你也可以理解为 `let`  声明模仿了闭包的做法来简化循环过程。

## 如果是const呢

```js
var funcs = [];
for (const i = 0; i < 10; i++) {
    funcs[i] = function () {
        console.log(i);
    };
}
funcs[0](); // Uncaught TypeError: Assignment to constant variable.
```

结果会是报错，因为虽然我们每次都创建了一个新的变量，然而我们却在迭代 `（i++）` 中尝试修改 `const`  的值，所以最终会报错。

## 最佳实践

在我们开发的时候，**可能认为应该默认使用** `**let**`  **而不是** `**var**`  **，这种情况下，对于需要写保护的变量要使用** `**const**` **。**然而另一种做法日益普及：**默认使用** `**const**` **，只有当确实需要改变变量的值的时候才使用** `**let**` **。**这是因为大部分的变量的值在初始化后不应再改变，而预料之外的变量之的改变是很多 `bug`  的源头。

## 参考文章

1.  [ES6系列之let和const](https://github.com/mqyqingfeng/Blog/issues/82)
