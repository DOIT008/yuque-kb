---
description: "这是个神奇的组件(俗称\"传送门\")，被它包裹的元素或组件可以通过属性to任意指定渲染的位置，to的值是一个元素选择器，另外还有一个属性disabled表示是否启用这种\"传送\"的功能。举个例子// Father.vue         "
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/rxicbn"
updated: "2021-06-06T09:22:47.000Z"
---

# Teleport

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/rxicbn)

<details class="toc-details">
<summary>本页结构（4 个小节）</summary>

- 举个例子
- 代码示例
- 同一个（挂载）目标上使用多个teleport元素
- ​

</details>

这是个神奇的组件(俗称"传送门")，被它包裹的元素或组件可以通**过属性**`**to**`**任意指定渲染的位置**，`to`的值是一个元素选择器，另外还有一个属性`disabled`表示是否启用这种"传送"的功能。

## 举个例子

## 代码示例

```vue
// Father.vue
<template>
  <div>
    <button @click="handleToggleModal">显示模态框</button>
    // 表示将来.model-container内部的内容讲被渲染到#container1元素内部
    <teleport to="#container1">
      <div class="model-container" v-if="isShowModal">
        我是一个模态框
        <Modal :msg="msg"></Modal>
      </div>
    </teleport>
  </div>
</template>
<script>
import { reactive, toRefs } from "vue";
import Modal from "/@/components/Modal.vue";
export default {
  setup() {
    const state = reactive({
      count: 0,
      isShowModal: false,
      msg: "我来自组件Teleport1",
    });
    function handleToggleModal() {
      state.isShowModal = !state.isShowModal;
    }
    return {
      ...toRefs(state),
      handleToggleModal,
    };
  },
  components: {
    Modal,
  },
};
</script>
```

 

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite App</title>
  </head>
  <body>
    <div id="app"></div>
    <!-- teleport包裹的内容渲染的位置 -->
    <div id="container1"></div>
    <!-- 导出main.js -->
    <script type="module" src="/src/main.js"></script>
  </body>
</html>

```

虽然渲染的位置发生了改变，但其逻辑父亲却没有发生变化，例如上面的组件`Modal`的父亲依然是`Father`，所以`Father`内部的数据依然可以通过`props`传递到`Modal`组件。

## 同一个（挂载）目标上使用多个teleport元素

一个常见的用例场景是一个可重用的 `<Modal>` 组件，它可能同时有多个实例处于活动状态。对于这种情况，多个 `<teleport>` 组件可以将其内容挂载到**同一个目标元素**。顺序将是一个简单的追加——稍后挂载将位于目标元素中较早的挂载之后。

```vue
// 同一个目标元素modals
<teleport to="#modals">
  <div>A</div>
</teleport>
<teleport to="#modals">
  <div>B</div>
</teleport>

<!-- 渲染结果-->
<div id="modals">
  <div>A</div>
  <div>B</div>
</div>
```

​  

## ​
