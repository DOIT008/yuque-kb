---
description: "以前我们在使用v-model实现自定义组件的双向绑定的时候，在组件内部我们一般要使用一个model选项来配置我们绑定的属性以及要触发的自定义事件，现在我们不用了，不过Vue3.x要求却更加精准，下面我们就使用Vue3来创建两个实例来分别演示非form组件和form组件的v-model上的使用：..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/civ062"
updated: "2022-05-03T01:12:23.000Z"
---

# v-model

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/civ062)

::: info 本页结构
- 无form元素版
- 代码示例
- form版
- 其他
:::

以前我们在使用`v-model`实现自定义组件的双向绑定的时候，在组件内部我们一般要使用一个`model`选项来配置我们绑定的属性以及要触发的自定义事件，现在我们不用了，不过Vue3.x要求却更加精准，下面我们就使用Vue3来创建两个实例来分别演示非form组件和form组件的`v-model`上的使用：

## 无form元素版

使用

## 代码示例

```vue
// HelloWorld.vue
<no-form v-model= "data.msg" ></no-form>
<!--本质上-->
 <no-form :modelValue = "data.msg" @update:modelValue = "data.msg = payload" ></no-form>
```

定义

```vue
// noForm.vue
<template>
  <div>i am from noForm Component</div>
  <div>{{ modelValue }}</div>
  <button @click="changeVal()">改变值</button>
</template>

<script>
export default {
  props: {
    modelValue: String, //
  },
  emits: ["update:modelValue"], // 格式比较固定，不过这里的modelValue来源于上面props里的modelValue
  setup(props, ctx) {
    const changeVal = () => {
      ctx.emit("update:modelValue", "哈哈，看我七十二变！");
    };
    return {
      changeVal,
    };
  },
};
</script>

<style lang="scss" scoped></style>
```

> 默认情况下，组件上的 v-model 使用 modelValue 作为 prop 和 update:modelValue 作为事件。我们可以通过向 v-model 传递参数来修改这些名称：

还是上面的例子,我们把`modelValue`换成`value1`，就便成了这样：

使用

```vue
<no-form v-model:value1= "data.msg" ></no-form>
```

定义

```vue
// noForm.vue
<template>
  <div>i am from noForm Component</div>
  <div>{{ value1 }}</div>
  <button @click="changeVal()">改变值</button>
</template>

<script>
export default {
  props: {
    value1: String, //
  },
  emits: ["update:value1"], // 格式比较固定，不过这里的value1来源于上面props里的value1
  setup(props, ctx) {
    const changeVal = () => {
      ctx.emit("update:value1", "哈哈，看我七十二变！");
    };
    return {
      changeVal,
    };
  },
};
</script>

<style lang="scss" scoped></style>

```

## form版

使用

```vue
<has-form v-model:value2 = "data.msg" ></has-form>
<!--本质上-->
<has-form :value2 = "data.msg" @update:value2 = "data.msg = $event.target.value" ></has-form>
```

定义

```vue
// hasForm.vue
<template>
  <div>
    <input :value="value2" type="text" @input="handleChange($event)" />
  </div>
</template>

<script>
export default {
  props: {
    value2: String,
  },
  emits: ["update:value2"],
  setup(props, context) {
    const handleChange = (e) => {
      context.emit("update:value2", e.target.value);
    };
    return { handleChange };
  },
};
</script>

<style lang="scss" scoped></style>

```

## 其他

除此之外，一个自定义组件还可以使用多次`v-model`，不过估计不常用，如果想看，可以参考[官网](https://v3.cn.vuejs.org/guide/component-custom-events.html#v-model-%E5%8F%82%E6%95%B0)
