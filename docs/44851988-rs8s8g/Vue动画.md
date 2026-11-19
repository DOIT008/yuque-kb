---
description: "Vue动画的三种方式一、使用transition标签使用标签，自己写css动画：原理以上就是使用该种方法的原理，下面谈一下自己的理解：v-enter:就是元素准备显示的那一刻(那一帧)的类名，通常用来定义元素的初始状态，通常和v-leave-..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/lwgwab"
updated: "2020-06-13T15:13:01.000Z"
---

# Vue动画

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/lwgwab)

<details class="toc-details">
<summary>本页结构（5 个小节）</summary>

- Vue动画的三种方式
- 一、使用transition标签
- 代码示例
- 二、结合使用`Animate.css`
- 三、使用Vue的钩子函数

</details>

## Vue动画的三种方式

  

### 一、使用transition标签

  

使用`<transition name = "XXX" >`标签，自己写css动画：

  

#### 原理

  

![图片](/images/3b47f01c8f86b636.png)

  

以上就是使用该种方法的原理，下面谈一下自己的理解：

  

1.  `v-enter`:就是元素准备显示的那一刻(那一帧)的类名，通常用来定义元素的初始状态，通常和`v-leave-to`一样

2.  `v-enter-active`：从图中可以看出，该类名贯穿到元素显示为止，定义元素显示过程中的状态，同通常和`v-leave-active`一样

3.  `v-enter-to`：定义元素完全显示的状态，通常和`v-leave`一样

  

> 注意，通常上面的`v`会被替换成`transition`的`name`属性值,诸如下面的`fade-enter`、`fade-leave-to`等

  

#### 举个栗子

  

## 代码示例

```vue
<template>
  <div>
    <transition name="fade">
      <h1 v-if="isShow">动画实验组件</h1>
    </transition>

    <button @click="comin">出来</button>
    <button @click="disappear">消失</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    disappear() {
      this.isShow = false;
    },
    comin() {
      this.isShow = true;
    }
  }
};
</script>

<style lang="less" scoped>
// 入场动画，开始出现的那一刻，一帧
.fade-enter {
  opacity: 0;
}
// 入场，贯穿直到出来为止，
.fade-enter-active {
  transition: opacity 3s;
}
// 入场的最终形态
.fade-enter-to {
  opacity: 1;
}

.fade-leave {
  opacity: 1;
}
// 入场，贯穿直到出来为止，
.fade-leave-active {
  transition: opacity 3s;
}
// 入场的最终形态
.fade-leave-to {
  opacity: 0;
}
</style>
```

  

### 二、结合使用`Animate.css`

  

1.  使用`CDN`引用该库 

```html
<link href="https://cdn.jsdelivr.net/npm/animate.css@3.5.1" rel="stylesheet"
type="text/css">
```

2.  结合transition标签使用 

```html
<transition enter-active-class="animated bounceIn"
leave-active-class="animated bounceOut">
```

  

### 三、使用Vue的钩子函数

  

略
