---
description: "async/awaitES7 提出的async 函数，终于让 JavaScript 对于异步操作有了终极解决方案。No more callback hell。async 函数是 Generator 函数的语法糖。使用 关键字 async 来表示，在函数内部使用 await 来表示异步。想较于 ..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ut1474"
updated: "2020-09-26T02:20:46.000Z"
---

# ES6深入之——async/await

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ut1474)

<details class="toc-details">
<summary>本页结构（6 个小节）</summary>

- async/await
- 一、语法
- 代码示例
- await语法
- 二、Async函数的错误处理
- 三、async/await使用建议

</details>

## async/await

  

ES7 提出的`async` 函数，终于让 JavaScript 对于异步操作有了终极解决方案。No more callback hell。  
`async` 函数是 `Generator` 函数的语法糖。使用 关键字 `async` 来表示，在函数内部使用 `await` 来表示异步。

  

想较于 Generator，`Async` 函数的改进在于下面四点：

  

-   **内置执行器**。Generator 函数的执行必须依靠执行器，而 `Aysnc` 函数自带执行器，调用方式跟普通函数的调用一样

-   **更好的语义**。`async` 和 `await` 相较于 `*` 和 `yield` 更加语义化

-   **更广的适用性**。`co` 模块约定，`yield` 命令后面只能是 Thunk 函数或 Promise对象。而 `async` 函数的 `await` 命令后面则可以是 Promise 或者 原始类型的值（Number，string，boolean，但这时等同于同步操作）

-   **返回值是 Promise**。`async` 函数返回值是 Promise 对象，比 Generator 函数返回的 Iterator 对象方便，可以直接使用 `then()` 方法进行调用

  

## 一、语法

  

-   `async`自动将常规函数转换成`Promise`，返回值也是一个`Promise`对象

-   只有`async`函数内部的异步(一般是放在await后面的代码)操作执行完，才会执行`then`方法指定的回调函数

-   只有异步函数内部才可以使用`await`(也就是说`awiat`只能用在使用`async`声明的函数中)。

-   `await`表示等待的意思，强制后面的代码等待，直到`Promise`对象`resolve`，得到`resolve`的值(resolve参数)作为`await`表达式的运算结果,**一般情况下`await`后面跟的是一个`Pomise`**，**但如果后面不是`Promise`，则直接转化为立即`resolved`的`promise`**

  

例如：

  

## 代码示例

```js
function test1 () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(1)
        }, 10000)
    })
}

function test2 () {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(2)
        }, 15000)
    })
}

async function exc1 () {
    let res1 = await test1();//代码执行到这里会等待10秒，
     console.log(res1) // 10秒后才执行该代码
    let res2 = await test2(); // 再等待15秒
    console.log(res2)// 开始执行
}

exc1();
```

  

但如果是这样，因为await后面不是promise，所以返回值本身：

```js
async function add (){
     let result = await setTimeout(() => {
         console.log(21212)
     },2000);
     console.log(result)
}
add()
// 会立即执行result，2秒后才会打印21212
```

  

`async` 函数返回的是一个 `promise`  实例，必须等到内部所有的 `await` 命令的`Promise` 对象执行完，才会发生状态改变，也就是说必须等到async函数内部的异步操作执行完才会执行then方法指定的回调函数

```js
const delay = timeout => new Promise(resolve=> setTimeout(resolve, timeout));
async function f(){
    await delay(1000);
    await delay(2000);
    await delay(3000);
    return 'done';
}

f().then(v => console.log(v)); // 等待6s后才输出 'done'
```

如果有返回值则返回值会作为该实例的resolve参数，将来会作为该promise实例的then方法的参数，如果没有则是undefined。

## await语法

正常情况下，`await`命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。

```js
async function foo3() {
    let res = await 123
    return res
}

foo3().then(val=>{
    console.log(val);//123
})
```

另一种情况是，`await`命令后面是一个`thenable`对象（即定义了`then`方法的对象），那么`await`会将其等同于 Promise 对象。

```js
async function foo4() {
    // 定义一个thenable对象
    let obj = {
        name:'张三',
        then:function(resolve,reject){
            resolve(this.name)
        }
    }
    // 将其作为await的参数
    let res = await obj
    return res
}

foo4().then(val=>{
    console.log(val);// 张三
})
```

还有一种情况是await后面的promise实例的执行状态是rejected，那么此时reject参数会被catch方法的回调参数接收到：

```js
async function foo5() {
    await Promise.reject('我错了')
  // 相当于
  // return await Promise.reject('我错了')
}
foo5().then(val=>{
    console.log(val);
}).catch(error=>{
    console.log(error);// 我错了
})
```

## 二、Async函数的错误处理

  

`async` 函数的语法不难，难在错误处理上。  
先来看下面的例子：

  

```js
let a;
async function foo(){
    let result = await new Promise((resolve,reject)=>{
        reject(12121)
    })
    a = await 1;
}
foo().then(res=>{
    console.log(a)
})
// Error:12121
```

  

你会看到并不会执行`a = await1` 这段代码，也就是说，只要有一个`await`后面的`Promise`出现`reject`状态就不会执行后面的`await`代码。

  

**所以一般情况下要将`await`请求放在`try...catch`语句中**，像这样

  

```js
// 正确的写法
let a;
async function correct() {
    try {
        await Promise.reject('error')
        // 有几个await全部都放在这里
    } catch (error) {
        console.log(error);
    }
    a = await 1;
    return a;
}

correct().then(v => console.log(a)); // 1
```

也可以在await后面的promise对象加一个catch方法来处理可能出现的错误，像这样:

```js
async function f() {
  await Promise.reject('出错了')
    .catch(e => console.log(e));
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// 出错了
// hello world
```

## 三、async/await使用建议

1.  `await`命令后面的`Promise`对象，运行结果可能是`rejected`，所以最好把`await`命令放在`try...catch`代码块中。
2.  当存在多个await语句的时候，如果不是继发关系(即前后依赖的关系)，最好让他们同时触发，可以使用 `await Promsie.all()` ;
3.  await语句只能用在async函数中，用在其他函数中会报错
