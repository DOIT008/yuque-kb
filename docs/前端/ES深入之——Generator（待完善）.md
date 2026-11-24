---
description: "Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。特征一是function关键字与函数名之间有一个星号；二是函数体内部使用yield表达式，定义不同的内部状态（yield在英..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/xah1if"
updated: "2020-09-19T03:24:53.000Z"
---

# ES深入之——Generator（待完善）

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/xah1if)

<details class="toc-details">
<summary>本页结构（22 个小节）</summary>

- 特征
- 代码示例
- 执行规律
- yield表达式
- 和Iterator之间的关系
- 带参数的next
- for..of循环
- API
- Generator.prototype.throw()
- Generator.prototype.return()

</details>

Generator 函数是 ES6 提供的一种异步编程解决方案，语法行为与传统函数完全不同。首先可以把它理解成，Generator 函数是一个状态机，封装了多个内部状态。

## 特征

-   一是`function`关键字与函数名之间有一个星号；
-   二是函数体内部使用`yield`表达式，定义不同的内部状态（`yield`在英语里的意思就是“产出”）

## 代码示例

```js
function * gen () {
    yield 'hello';
  	console.log('在这里停止');
    yield 'world'
    yield 'future'
    return 'code'
}

var genRun = gen();// 这里的genRun是一个指针对象(也就是遍历器对象)，必须调用next()方法

// 第一次调用，一直执行到console.log地方，yield是暂停标记
genRun.next() // {value:'hello',done；false}
genRun.next() // {value:'world',done；false}
genRun.next() // {value:'future',done；fasle}
genRun.next() // {value:'code',done；true}
genRun.next() // {value:'undefined',done；true}
```

## 执行规律

下一步，必须调用遍历器对象的 `next` 方法，使得指针移向下一个状态。也就是说，每次调用 `next` 方法，内部指针就从函数头部或上一次停下来的地方开始执行，直到遇到下一个 `yield` 表达式（或return语句）为止。换言之，Generator 函数是分段执行的， `yield` 表达式是暂停执行的标记，而 `next` 方法可以恢复执行。

每次执行 `next` 都会返回一个对象。以第一个为例，对象中有 `value` 属性，值为 `yield` 后面表达式运行的结果，第二个是表示运行状态的属性 `done` ，是一个boolean值表示遍历是否结束。

第一次执行 ，gen函数会执行第一个yield，很明显对于上述例子遍历还没结束，所以是false；遇到yield就会停止执行，所以就不会执行console语句。

第二次执行 ，从console语句开始执行，一直运行到第二个yield语句执行完

同理第三次执行 。

第四次执行 ，Generator 函数从第三次`yield`表达式停下的地方，一直执行到`return`语句（如果没有`return`语句，就执行到函数结束）。`next`方法返回的对象的`value`属性，就是紧跟在`return`语句后面的表达式的值（如果没有`return`语句，则`value`属性的值为`undefined`），`done`属性的值`true`，表示遍历已经结束。

之后，再次执行gen函数value就是 `undefined` ，属性 `done`  就一直是true了

  

> 注意：yeild表达式只能用在Generator函数中，是直接关系不能嵌套(Generator函数中内部嵌套其他函数，在内部函数中使用yield中会报错)

  

### yield表达式

只有调用`next`方法才会遍历下一个内部状态，所以其实提供了一种可以暂停执行的函数。`yield`表达式就是暂停标志。

遍历器对象的`next`方法的运行逻辑如下。

（1）遇到`yield`表达式，就暂停执行后面的操作，并将紧跟在`yield`后面的那个表达式的值，作为返回的对象的`value`属性值。

（2）下一次调用`next`方法时，再继续往下执行，直到遇到下一个`yield`表达式。

（3）如果没有再遇到新的`yield`表达式，就一直运行到函数结束，直到`return`语句为止，并将`return`语句后面的表达式的值，作为返回的对象的`value`属性值。

（4）如果该函数没有`return`语句，则返回的对象的`value`属性值为`undefined`。

一般而言，在Gen函数中是有yield关键字的，其实在Generator函数中也可以不使用 `yield` 关键字，这时函数就编程了一个延迟执行的函数，但如果想要执行函数还要使用 `next` 方法，例如：

```js
function * foo() {
    console.log(123)
}
var fooIns = foo();
console.log(fooIns.next()); // {value:undefined,done:true},123
```

从上面可以看出， `fooIns` 对象只有调用了 `next()` 方法后才执行了 `console` ,说明yield在Generator函数中并不是必须的。

  

## 和Iterator之间的关系

**任意一个对象的****`Symbol.iterator`****方法，等于该对象的遍历器生成函数，调用该函数会返回该对象的一个遍历器对象。**

由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的`Symbol.iterator`属性，从而使得该对象具有 Iterator 接口。

```js
var obj = {};// 一个对象

obj[Symbol.iterator] = function *(){
    yield 12;
    yield 23;
    yield 45
};
console.log("[...obj]", [...obj])// [12,23,45]
```

Generator 函数执行后，返回一个遍历器对象。该对象本身也具有`Symbol.iterator`属性，执行后返回自身。

```js
function* gen() {
// some code
}
var barIns = gen();//barIns是一个遍历器对象
console.log("bar()[Symbol.iterator]()", barIns[Symbol.iterator]() === barIns)
// true
```

## 带参数的next

> `yield`表达式本身没有返回值，或者说总是返回`undefined`。`next`方法可以带一个参数，**该参数就会被当作上一个****`yield`****表达式的返回值，****注意这里面有一个关键字“上一个”yield表达式的值。注意区别于执行完next()返回值**

直接上例子：

```js
// 带参数的next
function *foo4() {
  	// 第一次next执行到的位置
    var a = yield 4;
    console.log(a);
  //第二次next执行到的位置，由于由于第二次执行next，参数是13，所以上一次yield表达式的值就是13，也就是说  yield 4等于13，所以a为13
    var b = yield 5;
    console.log(b);
    return a+b
      //第三次next执行到的位置，由于由于第三次执行next，参数是14，所以上一次yield表达式的值就是13，也就是说  yield 5等于13，所以a为14
}
var genFoo4 = foo4()
console.log("genFoo4.next(12)", genFoo4.next(12))
console.log("genFoo4.next(13)", genFoo4.next(13))
console.log("genFoo4.next(14)", genFoo4.next(14))
console.log("genFoo4.next(15)", genFoo4.next(15))

执行结果
// genFoo4.next(12) {value: 4, done: false}
// 13
// genFoo4.next(13) {value: 5, done: false}
// 14
// genFoo4.next(14) {value: 27, done: true}

// genFoo4.next(15) {value: undefined, done: true}
```

再看一个例子，摘自阮一峰老师的原文例子——

```js
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

很好奇，为啥最后一个 `value` 是 `42` 吧，其实这个42是 `5+24+13` 的结果——

-   首先明确 `x=5` 
-   第一次执行 `next` 方法，遇到 `yield (x + 1)` 就不执行了，所以所以此时根本不知道 `y` 是多少
-   第二次执行 `next` 方法，由于 `next` 参数是 `12` ，所以上一次 `yield` 表达式 `yield (x + 1)` 的值就是12，所以 `y=24` ；由于 `y/3=8` ，所以这次 `next` 方法的 `value` 是8
-   第三次执行 `next` 方法，由于 `next` 参数是13，苏以所以 `yield (y / 3)` 的值是13，也就是 `z=13` s；
-   所以就有了上面的解惑

## for..of循环

其实generator对象可以使用for...of循环来进行遍历，这样就不用依靠next方法了，例如：

```js
function *foo12() {
    yield 12;
    yield 13
    yield 14
    yield 15
    return 16
}

var gen_foo12 = foo12();
for (const iterator of gen_foo12) {
    console.log(iterator);
}
// 12，13，14，15
```

除了`for...of`循环以外，扩展运算符（`...`）、解构赋值和`Array.from`方法内部调用的，都是遍历器接口，例如：

```js
function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

// 扩展运算符
[...numbers()] // [1, 2]

// Array.from 方法
Array.from(numbers()) // [1, 2]

// 解构赋值
let [x, y] = numbers();
x // 1
y // 2

// for...of 循环
for (let n of numbers()) {
  console.log(n)
}
// 1
// 2
```

## API

## Generator.prototype.throw()

一看就知道，这个api是gen函数生成的遍历器实例的方法，用于抛出一个错误，抛出的错误一般被gen函数内部的 `try...catch` 捕获，例如：

```js
// 抛出错误
function *foo13(){
    try {
        yield 14
    } catch (error) {
        console.log('内部错误'+error);
    }
}

var gen_foo13 = foo13();
gen_foo13.next()//为什么先要执行next，这是因为gen_foo13是一个遍历器对象，并没有执行foo13内部的逻辑，执行next方法的时候才执行try。。catch,所以...
gen_foo13.throw('我错啦')// 内部错误我错啦
```

如果gen函数内部没有 `try..catch` ，那么遍历器对象抛出的错误将会被外部的 `try..catch` 接收，例如：

```js
var g = function* () {
  while (true) {
    yield;
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
} catch (e) {
  console.log('外部捕获', e);
}
// 外部捕获 a
```

如果那内部和外部都没有 `try...catch` ，那么将会抛出错误:

```js
var gen = function* gen(){
  yield console.log('hello');
  yield console.log('world');
}

var g = gen();
g.next();
g.throw();
// hello
// Uncaught undefined
```

## Generator.prototype.return()

Gen函数生成的遍历器Iterator对象还有一个`return`方法，可以返回给定的值，并且终结遍历 Generator 函数。例如：

```js
// return
function *foo(){
    yield 12;
    yield 13;
    yield 14
}

var genFoo= foo();
console.log("genFoo.next()", genFoo.next())
console.log("gemnFoo.return(67)", genFoo.return(67))
// genFoo.next() {value: 12, done: false}
// gemnFoo.return(67) {value: 67, done: true}

```

如果return方法没有传参数，第二个value就是 `undefined` 

## yield\*

如果在一个Gen函数内部调用了另一个Gen函数，一般来说需要在前者内部进行遍历，但是很麻烦，现在不用了，可以使用yield\*

```js
function *foo1() {
    yield 1;
    yield* foo2()
    yield 2
}

var genFoo1 = foo1();
console.log(genFoo1.next());//{value: 1, done: false}
console.log(genFoo1.next());//{value:a, done: false}
console.log(genFoo1.next());//{value: b, done: false}
function *foo2() {
    yield 'a';
    yield 'b'
}

// 相当于
function foo3() {
    yield 1;
    for (var iterator of foo2()) {
        yield iterator
    }
    yield 2
}
```

> 本质上，yield\* 后面跟的是一个遍历器对象，所以任何对象只要有Iterator接口都可以使用yield\*进行遍历

## 作为对象属性的Generator函数

其实就是在一个普通的对象里面有一个方法或者属性是gen函数，例如：

```js
var obj = {
    *foo(){
        yield 12;
        yield 14
    }
}
```

## Gen函数中的this

Generator 函数总是返回一个遍历器，ES6 规定这个遍历器是 Generator 函数的实例，也继承了 Generator 函数的`prototype`对象上的方法。

```js
function *foo6() {
    yield 1;
    yield 3
}

foo6.prototype.say= function(){
    console.log('hello,你好！');
}
var genFoo6 = foo6();
console.log(genFoo6 instanceof foo6);// true，说明遍历器是gen函数的实例
genFoo6.say()//hello,你好
```

如果在Gen函数内部，使用this定义的有属性，例如这样，生成的遍历器是访问不到Gen函数的中this对象的，因为执行gen函数生成的是遍历器对象不是this对象：

```js
function *foo7() {
    this.a = 'jhaha'
    yield 123
}
var genFoo7 = foo7();
console.log("genFoo7.next()", genFoo7.next())
console.log(genFoo7.a);//undefiend
genFoo7.next()
```

但是如果我们想办法将gen函数内部定义的this指向gen函数的原型是不是就行了呢?

```js
function* F() {
    this.a = 1;
    yield this.b = 2;
    yield this.c = 3;
  }
  var f = F.call(F.prototype);// 这样的话在执行F函数的时候，内部的this，就相当于F.prototype

console.log("f.next()", f.next())// 执行了this.b = 2,相当于F.prototype.b = 2，和F.prototype.a = 1
console.log("f.next()", f.next())// 同理
console.log("f.next()", f.next())

console.log(f);//1,2,3 ,因为访问的是原型上的东西
```

## 应用

### 异步的操作的同步化表达

Generator 函数的暂停执行的效果，意味着可以把异步操作写在`yield`表达式里面，等到调用`next`方法时再往后执行。比如我们最常用的ajax请求：

```js
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);
  });
}

var it = main();
it.next();
```

在上述代码中，执行第一个 `next()` 后，其实就等待request 的执行结果    很明显也就是 `it.next(response)` 的返回值(虽然没有return，但是next执行的结果本来就有返回值)--一个对象， `value` 就是 `response` 

## Generator和异步应用

## Generator+promise

**原始封装：**

```js
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}

var g = gen();// 一个遍历器对象
var result = g.next();//执行到yield表达式并暂停，result是一个对象，value属性是一个promise
// 所以使用then方法，当promsie返回的时候执行回调函数
result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});
```

## generator和async/await的关系

async/await是generator函数的语法糖，只不过async/await不需要执行器，只需要把异步的操作放在awiat关键字后面，await是“等待”的意思，也就是说要等后面的异步操作执行完才会执行下面的代码，通常await后面跟的是一个promise。

## thunk函数和co模块

## thunk函数

thunk函数起源于函数参数的“求值问题”，也就是说函数的参数到底啥时间求值?

一种意见是["传值调用"](https://en.wikipedia.org/wiki/Evaluation_strategy#Call_by_value)（call by value），即在进入函数体之前，就计算 `x + 5`  的值（等于6），再将这个值传入函数 `f`  。例如：

```js
var x = 2;
function f(n) {
    return n*2
}

f(x+5)// 在f函数执行前就已经计算出x+5的值了
```

一种意见是是["传名调用"](https://zh.wikipedia.org/wiki/%E6%B1%82%E5%80%BC%E7%AD%96%E7%95%A5#.E4.BC.A0.E5.90.8D.E8.B0.83.E7.94.A8_.28Call_by_name.29)（call by name），即直接将表达式 `x + 5`  传入函数体，只在用到它的时候求值。Hskell语言采用这种策略。

```js
var x = 2;
function f(n) {
    return n*2
}
f(x+5)// 只有在函数f调用的时候才计算x+5的值
```

> 传值调用比较简单，但是对参数求值的时候，实际上还没用到这个参数，有可能造成性能损失。

**编译器的"传名调用"实现，往往是将参数放到一个临时函数之中，再将这个临时函数传入函数体。这个临时函数就叫做 Thunk 函数。例如：**

```js
function f(m){
  return m * 2;     
}

f(x + 5);

// 等同于

var thunk = function () {
  return x + 5;
};

function f(thunk){
  return thunk() * 2;
}
```

上面代码中，函数 `f`  的参数 `x + 5`  被一个函数替换了。凡是用到原参数的地方，对 Thunk 函数求值即可。

## co模块

co 模块可以让你不用编写 Generator 函数的执行器。

## 参考文章

1.  [ES6入门--Generator](https://es6.ruanyifeng.com/#docs/generator-async)
