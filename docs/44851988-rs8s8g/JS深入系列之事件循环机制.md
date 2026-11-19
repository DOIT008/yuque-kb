---
description: "一、两个概念宏任务：setTimeout、setInterval、DOM操作、Ajax请求微任务：Promise.then()、async/await二、EventLoop对于一个.js文件，代码中可能有同步代码也可能有异步代码，但异步代码中又有宏任务和微任务之分，当执行完同步代码后又会怎样执..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pwi0et"
updated: "2024-07-31T14:18:27.000Z"
---

# JS深入系列之事件循环机制

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pwi0et)

<details class="toc-details">
<summary>本页结构（4 个小节）</summary>

- 一、两个概念
- 二、EventLoop
- 三、一个例子
- 代码示例

</details>

## 一、两个概念

**宏任务**：`setTimeout`、`setInterval`、`DOM操作`、`Ajax请求`

**微任务**：`Promise.then()`、`async/await`

## 二、EventLoop

对于一个`.js`文件，代码中可能有同步代码也可能有异步代码，但异步代码中又有宏任务和微任务之分，当执行完同步代码后又会怎样执行呢？这就涉及到浏览器的事件循环机制了

下图就是浏览器的**事件循环机制**：

> 同步代码-->清空微任务-->页面渲染-->宏任务

关于事件循环更多参考

::: tip
熟悉事件循环？那谈谈为什么会分为宏任务和微任务。
:::

![图片](/images/aed2b486adc65ead.png)

## 三、一个例子

看一段代码

## 代码示例

```js
console.log(1);

setTimeout(() => {
  console.log(2);
}, 1000);

async function fn() {
  console.log(3);
  setTimeout(() => {
    console.log(4);
  }, 20);
  return Promise.reject();
}

async function run() {
  console.log(5);
  await fn();
  console.log(6);
}

run();

// 大概150ms
for (let i = 0; i < 90000000; i++) {}

setTimeout(() => {
  console.log(7);
  new Promise(resolve => {
    console.log(8);
    resolve();
  }).then(() => {
    console.log(9);
  });
}, 0);

console.log(10);
// 1,5,3,10，4，7，8，9，2
```

**为啥是这样？**

那我就用上面的图来解释一下当前代码的每一步的执行,我们知道 代码整体上是从上往下执行的：

1.  很明显`console.log(1)`首先会被执行，然后遇到第一个`setTimeout`,开始倒计时，当`1000ms`后被放入宏任务队列，

2.  紧接着遇到两个函数的定义`fn`和`run`，因为没有执行所以暂且不管

3.  然后执行`run()`,所以打印`console.log(5)`，再执行`await fn(`),因为外部有`async+await`后面的代码`console.log(6)`会等到`fn()`执行完毕后才执行

4.  在`fn`函数里，先执行`console.log(3)`,然后遇到`setTimeout`，开始倒计时，`20ms`后被放入到宏任务队列，由于`return reject`的存在所以`console.log(6)`不会执行

5.  `run()`函数执行完毕，开始执行`for`循环，该循环执行完毕大概需要`150ms`时间（记住此时`console.log(4)`已经在插入到宏任务队列里了第一个），之后遇到`setTimeout`，立马将其放入宏任务队列（第二个）

6.  开始执行`console.log(10)`

7.  至此所有的同步任务执行完毕，又由于此时没有微任务，所以开始执行拿出宏任务队列中的第一个`console.log(4)`执行，完毕后第一次循环结束

8.  开始第二次循环，查找同步任务-->微任务发现没有，拿出宏任务中的第二个`console.log(7)`执行，第二次循环结束

9.  重复寻找同步任务和微任务，发现有微任务，执行完所有的微任务`Promise`，清空所有的微任务---打印`console.log(8)`和`console.log(9)`

10.  当时间到`1000ms`时，执行宏任务`console.log(2)`，结束
