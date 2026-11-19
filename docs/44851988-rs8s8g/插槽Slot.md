---
description: "插槽Slot插槽是Vue实现内容分发的API，常用于复合组件（嵌套）的开发，该技术在通用组件库中有大量的应用分为三类：匿名插槽，具名插槽，和作用域插槽匿名插槽 我在匿名插槽中  // 子组件         ..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/egg96b"
updated: "2023-05-04T02:21:05.000Z"
---

# 插槽Slot

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/egg96b)

插槽是Vue实现内容分发的API，常用于复合组件（嵌套）的开发，该技术在通用组件库中有大量的应用

  

**分为三类：匿名插槽，具名插槽，和作用域插槽**

  

## 匿名插槽

  

## 代码示例

```vue
<!-- 父组件-->
<child2>我在匿名插槽中</child2>

// 子组件
<template>
  <div>
    <!-- 上面的字符串将显示在slot标签所在的位置 -->
    <slot></slot>
  </div>
</template>
```

  

## 具名插槽

  

```vue
<!-- 父组件 -->
     <child2>
      <!-- 具名插槽，这里的content和子组件的slot标签的name属性值对应 -->
      <template v-slot:content>
        <h1>我是将来要在具名插槽中显示</h1>
      </template>
    </child2>

<!----子组件-->
<slot name="content" ></slot>
```

  

> 其实匿名插槽也是有名字的只不过名字是default,所以常常忽略

  

## 作用域插槽

  

通常作用域插槽是建立在具名插槽的基础上的,因为要知道到底是哪个插槽上的数据

  

```vue
<!-- 父组件 -->
     <child2>
<!-- 作用域插槽:将子组件的数据显示在父组件的中，这里的slotProps是一个对象存放来自子组件插槽上的数据 -->
         <!----{baz}是ES6的解构----->
      <template v-slot:content = "{baz}">
        <h1>我是将来要在具名插槽中显示{{baz}}</h1>
      </template>
    </child2>

<!----子组件-->
<slot name="content" baz = "bazzzzzzzzzz" ></slot>
```

  

对于如果子组件的数据绑定在匿名插槽中,就可以省略`content`了

  

```vue
<child2>
    <template v-slot = "slotProps">
		<h1>我是将来要在具名插槽中显示{{slotProps.baz}}</h1>
    </template>
</child2>

<slot baz = "bazzzzzzzzzz" ></slot>
```

  

其实`slot`标签就像一个坑位,这个坑位在哪儿将来的内容就在哪儿...
