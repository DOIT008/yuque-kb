---
description: "全局注册Mixin需要在入口文件main.js中进行注册，不过最好还是使用OptionAPI的形式进行注册，setup函数不行import { createApp } from \"vue\"; // 引入createApp函数 // 执行挂载进行实例化  const app = createAp..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/fylqks"
updated: "2023-08-16T08:34:43.000Z"
---

# 混入Mixin

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/fylqks)

::: info 本页结构
- 全局注册Mixin
- 代码示例
- CompositionAPI和mixins
- 参考文章
:::

## 全局注册Mixin

需要在入口文件`main.js`中进行注册，不过最好还是使用`OptionAPI`的形式进行注册，`setup`函数不行

## 代码示例

```js
import { createApp } from "vue"; // 引入createApp函数
// 执行挂载进行实例化

const app = createApp(App);
// 混入
app.mixin({
  created() {
    console.log("杨白劳");
  },
});
```

其他的就和Vue2.的内容差不多了，可以参考这篇文章：[https://www.yuque.com/alipayqxigqpgusn/io36ci/rg46ax](https://www.yuque.com/alipayqxigqpgusn/io36ci/rg46ax)

## CompositionAPI和mixins

在vue2中mixin会遇到一些问题，那就是个各种冲突：比如命名冲突，生命周期钩子冲突，函数冲突等，你还要浪费精力去处理各种优先级还有这些种种冲突。

但是compositionAPI的出现就没有了这种顾虑，通过封装一个函数然后将所有的变量封装在函数中，在使用的使用直接调用函数就行了：

> 在特性描述前面加上“use”是一种Composition API命名约定。

```js
//useCounter.js
import { ref, computed } from "vue";

export default function () {
 const count = ref(0);
 const double = computed(() => count * 2)
 function increment() {
  count.value++;
 }
 return {
  count,
  double,
  increment
 }
}
```

要在组件中使用该函数，我们只需将模块导入组件文件并调用它（注意导入是一个函数）。这将返回我们定义的变量，随后我们可以从 setup 函数中返回它们。

```js
// MyComponent.js
import useCounter from "./useCounter.js";

export default {
 setup() {
  const { count, double, increment } = useCounter();// 因为函数中返回的是一个对象
  return {
   count,
   double,
   increment
  }
 }
}
```

当然，上述的`userCenter`函数还可以传参，只要 我们愿意我们就可以改造成我们想要的任何形式：

​  

```js
//useCounter.js
import { ref, computed } from "vue";

export default function (count1:number) {
 const count = ref(count1);
 const double = computed(() => count * 2)
 function increment() {
  count.value++;
 }
 return {
  count,
  double,
  increment
 }
}
```

 

```js
// MyComponent.js
import useCounter from "./useCounter.js";
export default {
 setup() {
  const { count, double, increment } = useCounter(1);// 淡然可以传入一个ref数据，就看需要了
  return {
   count,
   double,
   increment
  }
 }
}
```

## 参考文章

1.  [浅谈Vue3 Composition API如何替换Vue Mixins](https://www.yht7.com/news/83745)​
