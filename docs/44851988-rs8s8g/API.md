---
description: "nextTick在Vue2.x中，如果我们想拿到更新后的DOM或者数据，往往需要使用this.$nextTick(callback)，但是在Vue3.x中就没有this了，Vue3.x将该功能抽离成了一个函数nextTick：import {nextTick} from 'vue' nextT..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/hpeg4f"
updated: "2021-07-15T13:53:52.000Z"
---

# API

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/hpeg4f)

::: tip 关于这篇短文
内容来自语雀原文，已保留核心信息。更多上下文可点击上方「查看原文」。
:::

## nextTick

在Vue2.x中，如果我们想拿到**更新后的DOM或者数据**，往往需要使用`this.$nextTick(callback)`，但是在Vue3.x中就没有`this`了，Vue3.x将该功能抽离成了一个函数`nextTick`：

## 代码示例

```js
import {nextTick} from 'vue'
nextTick(()=>{
	....
})
```
