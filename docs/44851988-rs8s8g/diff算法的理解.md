---
description: "执行3w1h的策略：whatdiff算法是虚拟dom技术的必然产物，为什么呢？因为当数据发生变化的时候，就要比较新旧虚拟DOM，这个过程就是diff，然后将变化的部分生成真正的DOM渲染在页面上。同时我们知道DOM是一个树，如果没有复杂度是O(n3)，而diff算法的复杂度是O(n)whyvu..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/yt9qvm"
updated: "2024-07-10T13:37:55.000Z"
---

# diff算法的理解

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/yt9qvm)

执行3w1h的策略：

## what

diff算法是虚拟dom技术的必然产物，为什么呢？因为当数据发生变化的时候，就要比较新旧虚拟DOM，这个过程就是diff，然后将变化的部分生成真正的DOM渲染在页面上。同时我们知道DOM是一个树，如果没有复杂度是O(n3)，而diff算法的复杂度是O(n)

## why

vue2中降低了Watcher的粒度，每个组件实例都有一个Watcher，只有通过diff算法才能精确知道哪里发生了变化

## when

对于一个实例，当数据发生变化组件实例执行更新函数得时候(数据发生变化，因为数据响应式的原因会触发setter，而这个setter会把Watcher添加到事件循环中，通过eventloop循环来执行)，这个时候回比较两个新旧虚拟DOM的节点，这个过程其实就是patch

## how

diff算法的执行策略是“深度优先，同层比较”，深度优先的意思就是对于两组节点，diff算法会先看其有没有子节点或文本节点，然后会在同一层进行比较，在比较的过程中会通过首尾比较的方式寻找相同的节点，如果没找到就会执行一般的循环，到最后一般都会留下一些节点，要么删除要么新增，执行相应的算法就行了，除此之外，通过key也可以精确的确定哪些节点变化了，diff算法也就更高效。
