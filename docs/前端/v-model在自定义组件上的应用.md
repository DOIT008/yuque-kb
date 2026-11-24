---
description: "“一个组件上的 v-model 默认会利用名为 value 的 prop 和名为 input 的事件，但是像单选框、复选框等类型的输入控件可能会将 value attribute 用于不同的目的。model 选项可以用来避免这样的冲突”上述是引用Vue官方文档上的原话，这句话看似平常无奇，但却..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/tb7zht"
updated: "2023-04-11T06:41:33.000Z"
---

# v-model在自定义组件上的应用

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/tb7zht)

<details class="toc-details">
<summary>本页结构（4 个小节）</summary>

- 自定义组件
- 代码示例
- 使用组件
- 参考资料

</details>

> “一个组件上的 `v-model` 默认会利用名为 `value` 的 prop 和名为 `input` 的事件，但是像单选框、复选框等类型的输入控件可能会将 `value` attribute 用于[不同的目的](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/checkbox#Value)。`model` 选项可以用来避免这样的冲突”

  

上述是引用Vue官方文档上的原话，这句话看似平常无奇，但却暴露出了一个非常重要的结论-- `v-model` 其实质实是 `v-bind:value` 和 `@input` 的语法糖，也就是说你通过结合 `v-bind` 和 `@input` 完全可以模拟实现 `v-model` 的功能。

这里主要说的是结合选项model来实现自定义组件上的 `v-model` ：

## 自定义组件

直接上代码：

## 代码示例

```vue
// diyCompo组件源码
<template>
  <div>
    <input type="text" v-model="searchText" />
    <button @click="changeVal">修改数据</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchText: ""
    };
  },
  // 这里的model选项就是来改变默认的v-model绑定的属性和事件的
  model: {
    prop: "modelProp", // 定义使用组件内部的哪个数据来接收组件上v-model绑定的数据，相当于在组件上使用v-bind绑定modelProp= "testData"，其实默认是value属性
    event: "change" // 将来要抛出一个change事件来更改当前组件绑定的值，默认是input事件
  },
  props: {
    modelProp: {
      type: String,
      default: ""
    }
  },
  // searchText是input绑定的数据，初始化的时候当然要让组件上的数据和内部绑定的数据保持一致啦，所以要进行初始化
  mounted() {
    this.searchText = this.modelProp;
  },
  watch: {
    // 当组件上绑定的数据发生改变的时候，由于会触发modelProp数据发生改变，所以要让searchText也要进行更新
    modelProp(val) {
      this.searchText = val;
    }
  },
  methods: {
    // 抛出change事件，通知组件绑定的数据进行更新--“哈哈改变了吧”
    changeVal() {
      this.$emit("change", "哈哈改变了吧！");
    }
  }
};
</script>

<style lang="scss" scoped></style>

```

## 使用组件

```vue
<template>
  <div class="home">
    <diyCompo v-model="testData"></diyCompo>
      <!-- 相当于 -->
    <diyCompo :modelProp="testData"  @change="更新数据testData的代码;"></diyCompo>
    <!-- 这里的modelProp和事件change来自于组件内部的model选项 -->
    
  </div>
</template>
```

这里的 `testData` 的值将会传入这个名为 `modelProp`  的 prop。同时当 `<diyCompo>` 触发一个 `change` 事件并附带一个新的值的时候，这个 `testData`  的值将会被更新。

## 参考资料

1.  [自定义组件和v-model](https://cn.vuejs.org/v2/guide/components-custom-events.html#%E8%87%AA%E5%AE%9A%E4%B9%89%E7%BB%84%E4%BB%B6%E7%9A%84-v-model)
