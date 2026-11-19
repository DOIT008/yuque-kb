---
description: "源码在src\\core\\vdom\\patch.js - updateChildren()函数结论其实key的作用主要是为了高效的更新虚拟DOM，原理是vue在 patch 过程中通过key开精准判断虚拟DOM是否相同的从而避免不必要的对DOM的操作，也就更高效。假设对一个列表有如下操作:在Vu..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qpik59"
updated: "2024-07-10T13:39:10.000Z"
---

# key的作用和原理

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qpik59)

## 源码

在src\\core\\vdom\\patch.js - updateChildren()函数

## 结论

**其实key的作用主要是为了高效的更新虚拟DOM，原理是vue在** `**patch**` **过程中通过key开精准判断虚拟DOM是否相同的从而避免不必要的对DOM的操作，也就更高效。**

假设对一个列表有如下操作:

![2021-01-28_201105.png](https://cdn.nlark.com/yuque/0/2021/png/1528528/1611835937206-2a0a4c06-a735-4b4a-96a7-4d21f6907294.png)

在Vue3内部主要是通过同时判断节点的`type`和`key`是否相同来确认节点是否一样的，如果没有设置key，那么在调用 `updateChildren` （主要作用是更新节点）内部的 `sameVnode` 方法的时候就会认为是相同的节点(因为key都是`undefined`)，从而就会强制更新。

![2021-01-28_195838.png](https://cdn.nlark.com/yuque/0/2021/png/1528528/1611835428339-f7a2d8a1-567d-47e7-a789-226d3e4c9c45.png)

  

如果配置了 `key` ，那么源码内部就可以通过一些算法(比如猜测首尾节点是否相同)，来只更新那些有变化的节点，大大减少了操作虚拟DOM的次数，效率也会更高。

像这样：

## 代码示例

```plain
// 首次循环 patch A
A B C D E
A B F C D E
// 第 2 次循环 patch B
B C D E
B F C D E
// 第 3 次循环 patch E
C D E
F C D E
// 第 4 次循环 patch D
C D
F C D
// 第 5 次循环 patch C
C 
F C
// oldCh 全部处理结束，newCh 中剩下的 F，创建 F 并插入到 C 前面
```
