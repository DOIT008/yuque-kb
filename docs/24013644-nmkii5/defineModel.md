---
description: "defineModel 是 Vue 3.4+ 版本引入的一个编译器宏（Compiler Macro），旨在简化组件间 双向绑定（v-model） 的实现。在 defineModel 出现之前，实现双向绑定需要手动声明 props 和 emits，逻辑比较繁琐。defineModel 极大地简化..."
source: "https://www.yuque.com/alipayqxigqpgusn/nmkii5/vs3pzfekakpfcpnm"
updated: "2026-03-06T08:21:41.000Z"
---

# defineModel

> 来源：语雀「工作」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/nmkii5/vs3pzfekakpfcpnm)

<details class="toc-details">
<summary>本页结构（16 个小节）</summary>

- 1\. 为什么需要 defineModel
- 1.1. 在 Vue 3.4 之前（旧写法）：
- 代码示例
- 1.2. 使用 defineModel（新写法）：
- 1.3. 两者父组件写法保持
- 2\. defineModel 的核心功能
- 2.1. 基础用法
- 2.2. 默认值 与必填项
- 2.3. 命名 `v-model`（多个双向绑定）
- 2.4. 内置修饰符（Modifiers）

</details>

defineModel 是 Vue 3.4+ 版本引入的一个**编译器宏（Compiler Macro）**，旨在简化组件间 **双向绑定（v-model）** 的实现。

在 defineModel 出现之前，实现双向绑定需要手动声明 `props` 和 `emits`，逻辑比较繁琐。**defineModel 极大地简化了这个过程。**

## 1\. 为什么需要 defineModel

### 1.1. 在 Vue 3.4 之前（旧写法）：

子组件需要接收一个 `prop`，并在值改变时触发一个 `update` 事件 。

## 代码示例

```vue
<!-- Child.vue -->
<script setup>
  const props = defineProps(['modelValue'])
  const emit = defineEmits(['update:modelValue'])

  function updateValue(e) {
    emit('update:modelValue', e.target.value)
  }
</script>

<template>
  <input :value="modelValue" @input="updateValue" />
</template>
```

### 1.2. 使用 defineModel（新写法）：

```vue
<!-- Child.vue -->
<script setup>
  const model = defineModel() // 这一行直接替代了 props 和 emits 的声明
</script>

<template>
  <input v-model="model" />
</template>
```

### 1.3. 两者父组件写法保持

```jsx
<Child v-model="parentMsg" />
```

## 2\. defineModel 的核心功能

### 2.1. 基础用法

`defineModel()`返回一个`**ref**` 对象。当你修改这个 `ref` 的值时，Vue 会自动触发底层的事件，将新值同步给父组件。

```jsx
const model = defineModel()
model.value = 'hello' // 父组件绑定的变量会自动更新
```

### 2.2. 默认值 与必填项

可以像定义 `props` 一样给它传递选项

```jsx
const model = defineModel({ default: '默认值', required: true })
```

### 2.3. 命名 `v-model`（多个双向绑定）

如果组件需要多个 `v-model`（例如一个表单组件既要绑定“标题”又要绑定“内容”）

```jsx
// 子组件 Child.vue
const title = defineModel('title')
const content = defineModel('content')
```

 

```jsx
<template>
  < !-- 父组件使用 -->
  <Child v-model:title="myTitle" v-model:content="myContent" />
</template>
```

### 2.4. 内置修饰符（Modifiers）

你可以获取 `v-model` 的修饰符（如`.trim`, `.number`）或者自定义修饰符。  
`defineModel` 的返回值可以解构为一个数组，第二个元素就是修饰符对象：

```jsx
// 子组件
const [model, modifiers] = defineModel({
  // set 转换器：在写入值到父组件前进行处理
  set(value) {
    if (modifiers.uppercase) {
      return value.toUpperCase()
    }
    return value
  }
})
```

 

```vue
<template>
  < !-- 父组件使用自定义修饰符 .uppercase -->
    <Child v-model.uppercase="myText" />
  </template>
```

## 3\. 注意事项

-   **版本要求**：必须使用 **Vue 3.4** 或更高版本。
-   **它是宏**：和 `defineProps` 一样，你不需要从 vue 中手动 `import` 它，编译器会自动识别。
-   **响应式**：`defineModel` 返回的是一个 `Ref`，在 `<script>` 中访问需要 `.value`，在`<template>` 中直接使用。
-   **底层原理**：它本质上仍然是 `props + emits` 的组合，只是编译器帮你写了那部分重复的代码。

## 4\. 总结：为什么要用它？

-   **代码量极少**：减少了冗长的模板代码。
-   **逻辑清晰**：在子组件里，处理双向绑定的变量就像处理本地 `ref` 一样简单。
-   **更好的类型支持**：配合 TypeScript 使用时，类型推导更自然。

## 5\. 案例

使用 `defineModel` 封装自定义 `Input` 组件非常直观，因为它让你在子组件内操作 `v-model` 就像操作一个本地变量一样简单。

### 5.1. 子组件：CustomInput.vue

```vue
const model = defineModel({

  <div class="custom-input-container">

    <label v-if="label" class="input-label">{{ label }}</label>

                                                                 :placeholder="placeholder"

                                                                   <small>当前长度: {{ model.length }}</small>

                                                                   .custom-input-container {
```

### 5.2. 父组件：App.vue

父组件使用该组件时，语法与使用原生`<input>` 的 `v-model` 完全一致。

```jsx
import { ref } from 'vue'

import CustomInput from './CustomInput.vue'

const username = ref('张三')

  <h3>父组件中的值: {{ username }}</h3>

    <button @click="username = ''">清空输入</button>
```

### 5.3. 进阶用法：处理数据转换 (使用 `set / get`)

```jsx
const model = defineModel({

  return value.toUpperCase()

                          <input v-model="model" />
```

  

> 来自: [为什么说 defineModel 是 Vue3 最好用的新特性？附完整示例讲解\_vue3 definemodel-CSDN博客](https://blog.csdn.net/m0_74916313/article/details/156865412)

​  

​
