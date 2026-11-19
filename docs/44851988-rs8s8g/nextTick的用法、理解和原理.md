---
description: "总结我们知道数据总会更新，也就意味着DOM也会跟着更新，但是如果我们想要拿到更新后的DOM或数据就要使用nextTick，其实现原理是这样的：我们知道Vue再更新DOM的时候是异步的，也就意味着当数据发生改变的时候，并不是立即更新，而是开启一个队列，并缓冲在同一个事件循环中所发生的所有的数据的..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pqoof5"
updated: "2022-05-08T10:19:27.000Z"
---

# nextTick的用法、理解和原理

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pqoof5)

## 总结

我们知道数据总会更新，也就意味着DOM也会跟着更新，但是如果我们想要拿到更新后的DOM或数据就要使用nextTick，

**其实现原理是这样的**：

我们知道Vue再更新DOM的时候是**异步的，也就意味着当数据发生改变的时候，并不是立即更新，而是开启一个队列**，并缓冲在同一个事件循环中所发生的所有的数据的变更，这个策略就会导致上述我们数据的变更并不会立即更新到DOM上，这也就是我们为啥要使用`nextTick`**，nextTick会在队列加入一个函数callback（就是nextTick的回调，Promise），遍历循环，由于是在最后，所以肯定是DOM已经更新完了**。
