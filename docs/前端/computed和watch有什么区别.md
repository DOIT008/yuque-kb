---
description: "computed1. computed 是计算属性,也就是计算值,它更多⽤于计算值的场景 2. computed 具有缓存性,computed的值在getter执⾏后是会缓存的，​只有在它依赖的属性值改变之后，下⼀次获取 computed的值时才会重新调⽤对应的getter来计算 3. com..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/dg0hcs"
updated: "2021-02-24T11:58:23.000Z"
---

# computed和watch有什么区别

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/dg0hcs)

::: tip 关于这篇短文
内容来自语雀原文，已保留核心信息。更多上下文可点击上方「查看原文」。
:::

## computed

1\. computed 是计算属性,也就是计算值,它更多⽤于**计算值的场景**

2\. computed 具有**缓存性**,computed的值在getter执⾏后是会缓存的，**只有在它依赖的属性值改变之后，下⼀次获取**

**computed****的值时才会重新调⽤对应的****getter****来计算**

3\. computed 适⽤于计算⽐较消耗性能的计算场景

## watch:

1\. 更多的是「**观察**」的作⽤,类似于某些数据的监听回调

2. **⽆缓存性**，⻚⾯重新渲染时值不变化也会执⾏
