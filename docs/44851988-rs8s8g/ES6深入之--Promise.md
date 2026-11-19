---
description: "PROMISE所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果，promise实例有三种状态，分别是pending（初始化），resolved（成功），rejected（失败），根据异步操作的结果来确定当前是哪种状态，并且一旦状态发生改变就不..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pgiydw"
updated: "2023-03-06T09:27:52.000Z"
---

# ES6深入之--Promise

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pgiydw)

::: info 本页结构
- PROMISE
- 基础用法
- 代码示例
- Promise实例方法
- 一、promise.then()
- 二、promise.catch()
- 三、promise.finally（callback）
- Promise自带api
- 四、p=Promise.all(\[p1,p2,p3…\])
- 五、p=Promise.race(\[p1,p2,p3…\])
:::

## PROMISE

所谓`Promise`，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果，`promise`实例有三种状态，分别是`pending`（初始化），`resolved`（成功），`rejected`（失败），根据异步操作的结果来确定当前是哪种状态，并且一旦状态发生改变就不会再变了。

## 基础用法

在使用`promise`的时候首先要创建一个`promise`实例，像这样：

## 代码示例

```js
const promise = new Promise(function(resolve,reject){
    if(true){
        resolve(12)
    }else{
        reject('error')
    }
})
```

`Promise`构造函数接受一个函数作为参数，该函数的两个参数分别是`resolve`和`reject`。它们是两个函数，由 JavaScript 引擎提供，不用自己部署。

`resolve`函数的作用是，将`Promise`对象的状态从“未完成”变为“成功”（即从 pending 变为 resolved），在异步操作成功时调用，并将异步操作的结果作为参数传递出去；`reject`函数的作用是，将`Promise`对象的状态从“未完成”变为“失败”（即从 pending 变为 rejected），在异步操作失败时调用，并将异步操作报出的错误，作为参数传递出去。

`Promise`实例生成以后，可以用`then`方法分别指定`resolved`状态和`rejected`状态的回调函数。像这样：

```js
promise.then(function(val){
    // 异步操作成功
    console.log(val);
},function(error){
    // 异步操作失败
    console.log(error)
});
```

但一般情况下习惯写成`promise.then.catch` 的形式，如下：

```js
promise.then((val)=>{
    // 异步操作成功
    console.log(val);
}).catch((err)=>{
    // 异步操作失败
});
```

上面的代码表示，当异步操作成功的时候会进入`.then`回调函数，并将`resolve` 的值作为其参数`val` 传递进来 ；当异步操作失败时会进入`.catch` 回调，并将reject的值作为错误信息参数传递进来，可是不管那种状态，其操作的结果都会生成一个新的`promise` 实例

> promise实例在创建的时候就会执行，而里面的`resolve` 方法一定要是**在异步操作完成后再执行，怎么确定异步操作完成了就很关键**，否则就会在实例创建的时候作为同步任务被执行，这样就得不到我们想要的结果.

## Promise实例方法

### 一、promise.then()

作用是为`Promise`实例添加状态改变时的回调函数，也就是说当状态发生改变的时候会执行的回调函数。因为 `then` 方法返回的时一个新的Promise实例，因此可以使用链式调用。

```js
promise.then().then()...
```

### 二、promise.catch()

当promise的状态变成`rejected` 的时候会执行的回调，例如：

```js
getJSON('/posts.json').then(function(posts) {
  // ...
}).catch(function(error) {
  // 处理 getJSON 和 前一个回调函数运行时发生的错误
  console.log('发生错误！', error);
});
```

回调的结果会返回新的promise实例。

> promise中的错误有冒泡的性质，会一直向后传递，直到被捕获为止，也就是说，错误总是被下一个catch捕获。

### 三、promise.finally（callback）

表示无论前面的promise是何种状态，在执行完 `catch` 或 `then` 之后，都会执行的操作，不接受参数。

```js
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

## Promise自带api

### 四、p=Promise.all(\[p1,p2,p3…\])

其中`p1`,`p2`是`promise`实例，返回一个`promise`实例（如果不是实例会调用`Promise.resolve()`方法将其转化为`promise`实例），该实例的状态由`p1,p2,p3`决定，只有他们都是`fulfilled`状态的时候，`p`的状态才是`fulfilled`。

### 五、p=Promise.race(\[p1,p2,p3…\])

其中`p1,p2,p3`有一个先改变状态，`p`的状态就会发生改变，那个率先改变的`promise`实例的返回值就会传递给p的回调函数。

### 六、p=Promise. allSettled(\[p1,p2,p3…\])

只有其中的参数都有返回值的时候，不管p1,p2,p3是最后是何种状态，包装实例p才会结束，p的状态永远是 `fulfilled` ，p其回调函数的参数是一个数组，其中的每一项都是一个对象，根据每一项的状态对象的属性有所不同。

```js
const resolved = Promise.resolve(42);
const rejected = Promise.reject(-1);
const allSettledPromise = Promise.allSettled([resolved, rejected]);
allSettledPromise.then(function (results) {
  console.log(results);
});
// [
//    { status: 'fulfilled', value: 42 },
//    { status: 'rejected', reason: -1 }
// ]
```

### 七、p=Promise. any(\[p1,p2,p3…\])

只要其中一个变成`fulfilled`状态，p就变成`fulfilled`状态，只有所有的p实例变成`rejected`，p实例才会变成`rejected`状态，抛出错误

### 八、p= Promise.resolve(参数)

将参数转化为 `promise` 对象，参数有以下几种情况：

1.参数不是对象，直接返回心得 `promise` 实例，状态为 `resolved` 

2.参数是 `promise` 实例，直接返回不作任何处理，

3.不传参数，直接返回 `resolved` 状态的promise实例

4\. 一个对象，里面有 `then` 方法，会将其转化为 `promise` 对象，并且立即执行 `then` 方法，参考[阮一峰resolve](https://es6.ruanyifeng.com/#docs/promise#Promise-resolve)

### 九、p=Promise.reject()

和 `Promise.resolve()` 差不多，不过返回的实例状态是 `rejected` 。其参数会原封不动的作为 `reject` 的理由，变成后续方法 `catch` 的参数。

## 面试

## 如何用await让程序停顿指定的时间(休眠效果)
