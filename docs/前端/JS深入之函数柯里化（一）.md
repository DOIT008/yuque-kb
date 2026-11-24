---
description: "定义什么是函数柯里化?通俗一点的说就是这样一个函数——“接收一个函数作为参数（假设为 A ），执行完后时返回一个新的函数（假设为 _A ），用返回的新函数 _A 来处理 A 自带的参数”举个例子假设我们有个函数是 foo ，自带的参数 a ， b ， c ：function foo(a,b,c..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pgig2w"
updated: "2024-07-31T14:34:29.000Z"
---

# JS深入之函数柯里化（一）

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pgig2w)

<details class="toc-details">
<summary>本页结构（10 个小节）</summary>

- 定义
- 举个例子
- 代码示例
- 柯里化特点分析
- 特点
- 适用范围
- 柯里化通用式
- 执行分析
- 一个经典的面试题
- 参考文章

</details>

## 定义

什么是函数柯里化?通俗一点的说就是这样一个函数——

**“接收一个函数作为参数（假设为** `**A**` **），执行完后时返回一个新的函数（假设为** `**_A**` **），用返回的新函数** `**_A**` **来处理** `**A**` **自带的参数”**

## 举个例子

假设我们有个函数是 `foo` ，自带的参数 `a` ， `b` ， `c` ：

## 代码示例

```js
function foo(a,b,c){
//...
}
```

现在我们定义一个柯里化函数 `createCurr` ，其参数是 `fn` ，现在将函数 `foo` 作为参数传递过去，生成一个新的函数假设为 `_foo` ：

```js
let _foo = createCurr(foo)
```

然后用 `_foo` 来处理foo的参数 `a` ， `b` ， `c` ，因此下面的几个运行结果是相等的：

```js
_foo(1, 2, 3);
_foo(1, 2)(3);
_foo(1)(2, 3);
_foo(1)(2)(3);
foo(1, 2, 3);
```

在简单的场景下，可以不用借助柯里化通用式来转化得到柯里化函数，我们凭借眼力自己封装。

例如有一个简单的加法函数，他能够将自身的三个参数加起来并返回计算结果。

```js
function add(a, b, c) {
    return a + b + c;
}
```

那么 `add` 函数的柯里化函数 `_add` 则可以如下：

```js
function _add(a) {
    return function(b) {
        return function(c) {
            return a + b + c;
        }
    }
}
```

下面的运算方式是等价的。

```js
add(1, 2, 3);
_add(1)(2)(3);
```

当然，靠眼力封装的柯里化函数自由度偏低(**适用性比较窄**，比如上面的函数 `_add` ，我们只能这样使用 `_add(1)(2)(3)` )，柯里化通用式具备更加强大的能力。因此我们需要知道如何去封装这样一个柯里化的通用式。

## 柯里化特点分析

### 特点

虽然在一定程度上增加了函数的复杂性，降低了性能，比如使用了闭包、arguments等，但却增加了函数的通用性和灵活性。

### 适用范围

一般简单的情况尽量不要用柯里化，否则只会增加代码的复杂度；只有在情况比较复杂的时候(比如一个函数搞不定)建议使用。

## 柯里化通用式

通过 `_add` 可以看出，**柯里化函数的运行过程其实是一个参数的收集过程，我们将每一次传入的参数收集起来**，并在最里层里面处理。在实现 `createCurry` 时，可以借助这个思路来进行封装。

```js
// 简单实现
function createCurry(func, args) {
  	// 变量varity保存着func函数参数的长度，即有几个参数
    var arity = func.length;
  	// args来收集变量
    var args = args || [];
    return function() {
        var _args = [].slice.call(arguments);// 相当于var _args = Array.from(arguments),
        [].push.apply(_args, args);

        // 如果参数个数小于最初的func.length，则递归调用，继续收集参数
        if (_args.length < arity) {
            return createCurry.call(this, func, _args);
        }

        // 参数收集完毕，则执行func
        return func.apply(this, _args);
    }
}
```

测试

```js
function add(a,b,c){
    return a+b+c
}
let _add = createCurry(add);
_add(1,3)(5)//9

```

### 执行分析

1.  \_add函数其实是这样的：

```js
function() {
        var _args = [].slice.call(arguments);// 相当于var _args = Array.from(arguments),
        [].push.apply(_args, args);

        // 如果参数个数小于最初的func.length，则递归调用，继续收集参数
        if (_args.length < arity) {
            return createCurry.call(this, func, _args);
        }

        // 参数收集完毕，则执行func
        return func.apply(this, _args);
    }
```

2.  所以当执行 `_add(1,3)` 的时候， `_args` 就是数组 `[1,3]` ，然后通过 `[].push.apply(_args, args)` ，将 `args` (第一次 `args` 是 `[]` )合并到 `_args` 。
3.  判断 `_args` 的长度是不是小于 `arity` ，如果小于，说明参数不够，则继续递归收集参数，很明显第一次长度不够，所以再次执行 `createCurry` 函数，参数分别是 `func` 和叠加后的数组 `_args` 。
4.  这一次由于传入\`createCurry\` 的第二个参数是 `[1,3]` ，所以 `args` 就是 `[1,3]` ，同样的道理，这一次 `_args` 是 `[5]` ,合并后就成了 `[5,3,1]` ,满足条件，执行 `func` 函数 ，结果就出来了 `9` ，归根结底还是执行了 `fn` 。

## 一个经典的面试题

在前端面试中，你可能会遇到这样一个涉及到柯里化的题目。

```js
// 实现一个add方法，使计算结果能够满足如下预期：
add(1)(2)(3) = 6;
add(1, 2, 3)(4) = 10;
add(1)(2)(3)(4)(5) = 15;
```

这里的难点在于，参数个数不确定，我们不知道函数会执行几次。因此我们不能使用上面我们封装的createCurry的通用公式来转换一个柯里化函数。

...

更多的分析请见下面的参考文章，在这里我们把主要精力放在对封装后函数的理解上：

```js
function add() {
    debugger
    // 第一次执行时，定义一个数组专门用来存储所有的参数
    var _args = [].slice.call(arguments);
    // 在内部声明一个函数，利用闭包的特性保存_args并收集所有的参数值
    var adder = function () {
        var _adder = function() {
            // [].push.apply(_args, [].slice.call(arguments));
            _args.push(...arguments);
            return _adder;
        };
        // 利用隐式转换的特性，当最后执行时隐式转换，并计算最终的值返回
        _adder.toString = function () {
            console.log(index++);
            return _args.reduce(function (a, b) {
                return a + b;
            });
        }
        // 当return _adder的时候就会执行toString方法
        return _adder;// 是一个函数，每次return的时候都会调用toString方法
    }
    // return adder.apply(null, _args);
    return adder(..._args);
}

var a = add(1)(2)(3)(4);   // f 10
var b = add(1, 2, 3, 4);   // f 10
var c = add(1, 2)(3, 4);   // f 10
var d = add(1, 2, 3)(4);   // f 10

// 可以利用隐式转换的特性参与计算
console.log(a + 10); // 20
console.log(b + 20); // 30
console.log(c + 30); // 40
console.log(d + 40); // 50

// 也可以继续传入参数，得到的结果再次利用隐式转换参与计算
console.log(a(10) + 100);  // 120
console.log(b(10) + 100);  // 120
console.log(c(10) + 100);  // 120
console.log(d(10) + 100);  // 120
// 这里面涉及到闭包，所以add函数执行完后内部的变量_args并不会被销毁
```

首先要理解文章中的一句话——

> 当我们直接将函数参与其他的计算时，函数会默认调用toString方法，直接将函数体转换为字符串参与计算

这里的其他计算，包括打印console，return等需要识别出当前函数是啥的时候

  

  

## 参考文章

1.  [前端基础进阶（十）：深入详解函数的柯里化](https://www.jianshu.com/p/5e1899fe7d6b)
