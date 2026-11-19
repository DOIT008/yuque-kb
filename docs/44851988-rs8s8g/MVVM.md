---
description: "预习知识一、Vue的核心思想Vue的核心思想是：数据驱动应用MVVM的践行者为什么这么说呢？ 首先用过Vue的就知道，我们很少操作DOM，如果你想改变视图只需要改变对应的数据就行了，而视图的渲染工作就交给了Vue就行了，所以在Vue的应用中请尽量摒弃操作DOM的思想，而是要想着怎么玩数据就行了..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/tp5a0f"
updated: "2020-07-20T12:38:58.000Z"
---

# MVVM

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/tp5a0f)

## 预习知识

  

## 一、Vue的核心思想

  

Vue的核心思想是：

  

-   数据驱动应用

-   `MVVM`的践行者

  

**为什么这么说呢？**  
首先用过`Vue`的就知道，我们很少操作`DOM`，如果你想改变视图只需要改变对应的数据就行了，而视图的渲染工作就交给了`Vue`就行了，**所以在Vue的应用中请尽量摒弃操作`DOM`的思想**，而是要想着怎么玩数据就行了。

  

对于第二个，我们首先要明白什么是`MVVM`:

  

![Vue的MVVM](https://s1.ax1x.com/2020/03/19/86CVO0.png)

  

> 上图中的`View`其实就是视图(就是我们常见的各种页面，各种组件等)，Model就是数据（`Data`）

  

`MVVM`的三要素：**响应式，模板引擎和渲染**

  

1.  *响应式：Vue是如何监听数据的变化的？*  
    当数据发生变化的时候，视图View就会发生变化...，页面时如何监听到数据的变化的，这就是Vue的作用了

2.  *模板引擎：Vue的模板是如何的编写和解析？*  
    先看一下这个代码： 

## 代码示例

```vue
<template>
<!--这就是view 视图-->
  <div class="about">
    <h1>{{ message }}</h1>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这就是model
      message: "This is an about page"
    };
  }
};
</script>
```

  
    Vue是怎么将message转化成真正的数据的？为啥加一个`{{}}`就能渲染出对应的界面呢，这肯定就涉及到渲染引擎了

3.  *渲染：Vue是如何将模板转化成HTML的？*  
    其实Vue首先将模板转化成`渲染函数`，当数据发生变化的时候会执行该渲染函数，并将结果转化成`VDOM`(虚拟`DOM`)，然后再将该`VDOM`转化成真正的`DOM`

  

在上图你会发现，其实Vue主要做两件事，**其一监听数据(`data binding`)的变化来更新视图；其二当视图(`view`)更新（比如页面的点击事件）的时候去驱动数据进行更新**。

  

也就是说`Vue`的出现让专注我们的业务本身（视图和数据），至于怎么处理视图`view`和数据`data`之间的关系交给`Vue`就行了，大大提高了我们的开发效率。
