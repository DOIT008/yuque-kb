---
description: "Node.js采用V8作为js的解析引擎，而I/O处理方面使用了自己设计的libuv，libuv是一个基于事件驱动的跨平台抽象层（可以认为NodeJS的事件循环就是基于libuv实现的），封装了不同操作系统一些底层特性，对外提供统一的API，事件循环机制也是它里面的实现。根据Node.js官方..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/xebrio"
updated: "2024-07-10T09:24:30.000Z"
---

# NodeJS中的事件循环

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/xebrio)

::: info 本页结构
- NodeJS事件循环的6个阶段
- 三个重要的阶段
- timer阶段
- 代码示例
- poll 阶段
- check 阶段
- 与浏览器中事件循环的差别
:::

Node.js采用V8作为js的解析引擎，而I/O处理方面使用了自己设计的libuv，libuv是一个基于事件驱动的跨平台抽象层（**可以认为NodeJS的事件循环就是基于libuv实现的**），封装了不同操作系统一些底层特性，对外提供统一的API，事件循环机制也是它里面的实现。

根据Node.js官方介绍，每次事件循环都包含了6个阶段，对应到 libuv 源码中的实现，如下图所示：

![20190410105419532.png](https://cdn.nlark.com/yuque/0/2021/png/1528528/1614087618800-57681c58-c1d1-47b4-87e2-e428858be434.png)

## NodeJS事件循环的6个阶段

> 加粗的是我们重点关注的阶段，因为我们平常的异步操作都是在着三个阶段中处理的。

1.  **timers 阶段**：这个阶段执行timer（setTimeout、setInterval）的回调。
2.  I/O callbacks 阶段：执行一些系统调用错误，比如网络通信的错误回调。
3.  idle, prepare 阶段：仅node内部使用。
4.  **poll 阶段**：获取新的I/O事件, 适当的条件下node将阻塞在这里。
5.  **check 阶段**：执行 setImmediate() 的回调。
6.  close callbacks 阶段：执行 socket 的 close 事件回调。

## 三个重要的阶段

### timer阶段

timers 是事件循环的第一个阶段，**Node 会去检查有无已过期的timer，如果有则把它的回调压入timer的任务队列中等待执行**，事实上，Node 并不能保证timer在预设时间到了就会立即执行，因**为Node对timer的过期检查不一定靠谱，它会****受机器上其它运行程序影响，或者那个时间点主线程不空闲****。比如下面的代码，setTimeout() 和 setImmediate() 的执行顺序是不确定的**：

## 代码示例

```js
setTimeout(() => {
  console.log('timeout')
}, 0)

setImmediate(() => {
  console.log('immediate')
})
```

> 但是把它们放到一个I/O回调里面，就一定是 setImmediate() 先执行，因为poll阶段后面就是check阶段，否则就是setTimeout先行。​

### poll 阶段

poll 阶段主要有2个功能：

1.  **处理 poll 队列的事件**
2.  **当有已超时的 timer，执行它的回调函数**

even loop将同步执行poll队列里的回调，直到队列为空或执行的回调达到系统上限（上限具体多少未详），接下来even loop会去检查有无预设的setImmediate()，分两种情况：

1.  **若有预设的setImmediate(), event loop将结束poll阶段进入check阶段，并执行check阶段的任务队列。**
2.  **若没有预设的setImmediate()，event loop将阻塞在该阶段等待。**

注意一个细节，没有setImmediate()会导致event loop阻塞在poll阶段，这样之前设置的timer岂不是执行不了了？所以咧，在poll阶段event loop会有一个检查机制，检查timer队列是否为空，如果timer队列非空，event loop就开始下一轮事件循环，即重新进入到timer阶段。

### check 阶段

setImmediate()的回调会被加入check队列中， 从event loop的阶段图可以知道，check阶段的执行顺序在poll阶段之后。

**小结**

1.  **event loop 的每个阶段都有一个任务队列。**
2.  **当 event loop 到达某个阶段时，将执行该阶段的任务队列，直到队列清空或执行的回调达到系统上限后，才会转入下一个阶段。**
3.  当所有阶段被顺序执行一次后，称 event loop 完成了一个 tick。

## 与浏览器中事件循环的差别

浏览器环境下，**microtask的任务队列是每个macrotask执行完之后执行。**

![20190410123500323.png](https://cdn.nlark.com/yuque/0/2021/png/1528528/1614088285074-7143de20-8f82-46cb-a509-5502926d1d69.png)

而在Node.js中，**microtask会在事件循环的各个阶段之间执行，也就是一个阶段执行完毕，就会去执行microtask队列的任务。**

![20190410123532304.png](https://cdn.nlark.com/yuque/0/2021/png/1528528/1614088353690-ae89151b-ca1c-4eab-9d0a-5c25d60a1e1d.png)
