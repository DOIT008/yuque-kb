---
description: "我们在封装组件的时候，父to子的通信通常使用props，但是对于父组件上那些非props声明的属性怎么绑定给子组件呢——可以使用$attrs！一个很常见的例子——根据ElementUI封装我们自己的表格，要求是能够继承ElementUI自己的写法，我们知道ElementUI上的表格有很多属性—..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qgv6ca663f8rzeqn"
updated: "2023-09-08T09:38:56.000Z"
---

# $attrs

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qgv6ca663f8rzeqn)

我们在封装组件的时候，父to子的通信通常使用`props`，但是对于父组件上那些非`props`声明的属性怎么绑定给子组件呢——可以使用`$attrs`！

一个很常见的例子——根据ElementUI封装我们自己的表格，要求是能够继承ElementUI自己的写法，我们知道ElementUI上的表格有很多属性——

![image.png](/images/22ecc19c20ddcff9.png)

这些属性，不可能显式地通过`props`都传递过去，这时候就可以在子组件内使用`v-bind="$attrs"`绑定那些剩余的属性（数据），例如我们封装一个`custom-table`组件：

## 代码示例

```vue
<template>
  <div class="release-questions">
    <div class="form-wrapper"></div>
    <div class="table-wrapper">
      <custom-table
        :table-columns="tableColumns"
        border
        stripe
        :table-data="tableData"
      ></custom-table>
    </div>
  </div>
</template>

<script>
import customTable from '@/components/custom-table';

export default {
  name: 'releaseQuestions',
  components: {
    customTable,
  },
  data() {
    return {
      tableColumns: [
        {
          prop: 'resumeName',
          label: '问卷名称',
          width: 180,
        },
        {
          prop: 'resumeCount',
          label: '问卷数量',
          width: 180,
        },
      ],
      tableData: [
        { resumeName: '考研复试信息收集', resumeCount: 190 },
        { resumeName: '小升初信息收集', resumeCount: 210 },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>

```

那么在子组件内，使用`v-bind="$attrs"`：

```vue
<template>
  <el-table :data="tableData" v-bind="$attrs" style="width: 100%">
    <el-table-column
      v-for="(item, index) in tableColumns"
      :key="index"
      :prop="item.prop"
      :label="item.label"
      :width="item.width"
      :formatter="item.formatter"
    >
    </el-table-column>
  </el-table>
</template>
<script>
export default {
  props: {
    // 表格列
    tableColumns: {
      type: Array,
      required: true,
      default: () => [],
    },
    tableData: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    console.log(this.$attrs);
  },
};
</script>

<style lang="scss" scoped></style>

```

然后，很神奇的事情发生了😄

> 所以`$attrs`在封装高级组件（比如依赖某个组件库进行二次封装）的时候会非常有用！

相似的用法还有`$listeners`，用来在高级组件上绑定事件，用法通常是`v-on="$listeners"`

## 如何访问$attrs

```js
// 例如
<el-table border stripe highlight-current-row></el-table>

mounted(){
  console.log(this.$attrs)  // 你可以访问到任何在绑定到组件上的值
}
```
