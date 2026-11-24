---
description: "mixin混入混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项(类似data,methods等，你懂的)。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。如果混入的内容和原有的数据有冲突，会优先采用组..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/tlaase"
updated: "2022-12-28T13:26:14.000Z"
---

# 混入Mixin

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/tlaase)

## mixin混入

  

混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含**任意组件选项(类似data,methods等，你懂的)**。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。

  

> 如果混入的内容和原有的数据有冲突，会优先采用组件本身的内容，值为对象的选项，例如 `methods`、`components` 和 `directives`，将被合并为同一个对象。两个对象键名冲突时，取组件对象的键值对。

  

### 一、定义

  

#### 1.1 局部定义

  

## 代码示例

```js
// 定义局部混入
var mixinhello = {
  data() {
    return {
      hello: "你好"
    };
  },
    // 当然还有其他一般的组件选项，例如methods,props,生命周期等都可以定义
};

export.default {
  name: "HelloWorld",
  data() {
    return {
      hello: "你好123"
    };
  },
  // 使用混入mixins
  mixins: [mixinhello],
  props: {
    msg: String
  },
  created() {
    alert(this.hello);
  },
}
```

  

#### 1.2 全局定义

  

使用`Vue.mixin`,例如：

  

```js
Vue.mixin({
    //props，data，methods,生命周期...
})
```

  

但要注意的是，**一旦全局混入，所有组件的实例都将被影响...**

  

### 二、总结

  

可以把”混入“当作是对`export.default`对象内容的补充，仅此而已
