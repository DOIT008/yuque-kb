---
description: "beforeCreate()：此时组件实例还没创建，通常用于插件开发中一些初始化的工作created():此时数据已经完成了监听，可以操作数据，通常的异步请求就可以在这里beforeMount()：未执行DOM渲染和挂载mounted()：mounted是挂载的意思，也就是说此时已经完成了实例..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/fu6vol"
updated: "2022-12-28T13:40:35.000Z"
---

# Vue生命周期

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/fu6vol)

## 背景与思路

![image.png](https://cdn.nlark.com/yuque/0/2022/png/1528528/1672234832103-1620dd3a-167d-4ed9-a9c1-0ee94a6f75c0.png)

> -   beforeCreate()：此时组件实例还没创建，通常用于插件开发中一些初始化的工作
> -   created():此时数据已经完成了监听，可以操作数据，**通常的异步请求就可以在这里**
> -   beforeMount()：未执行DOM渲染和挂载
> -   mounted()：mounted是挂载的意思，也就是说此时已经**完成了实例的挂载，可以访问DOM的操作和数据的获取**
