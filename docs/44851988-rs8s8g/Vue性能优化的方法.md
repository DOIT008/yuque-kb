---
description: "1. 路由懒加载只有在使用到该路由的时候才加载该页面：const router = new VueRouter({   routes: [    { path: '/foo', component: () =&gt;import('./Foo.vue') }    ] })2. keep-alive..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/mg9dzg"
updated: "2021-01-30T10:34:26.000Z"
---

# Vue性能优化的方法

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/mg9dzg)

## 1\. 路由懒加载

只有在使用到该路由的时候才加载该页面：

## 代码示例

```js
const router = new VueRouter({
  routes: [
   { path: '/foo', component: () =>import('./Foo.vue') } 
  ]
})
```

## 2\. keep-alive缓存页面

对于有些界面我们可能不需要更新，此时我们就可以将其缓存起来，当然有些界面不需要缓存，我们可以给 `keep-alive` 配置 `includes` 属性和 `excludes` 属性即可。

```js
<template>
  <div id="app">
    <keep-alive>
      <router-view/> 
    </keep-alive>
  </div>
</template>
```

## 3\. v-for 遍历避免同时使用 v-if

为什么，就不用我讲了吧，之前的文章已经讲过

## 4\. 长列表性能优化

1.  如果列表是纯粹的数据展示，不会有任何改变，就不需要做响应化，可以使用 `Object.freeze` 将数据冻结
2.  如果是大数据长列表，可采用虚拟滚动，只渲染少部分区域的内容

```js
<recycle-scroller
class="items"
:items="items"
:item-size="24"
>
<template vslot="{ item }"> <FetchIte
mView
:item="item"
@vote="voteItem(item)"
/>
</template>
</recycle-scroller>
```

## 5\. 第三方插件按需引入

像 element-ui 这样的第三方组件库可以按需引入避免体积太大

```js
import Vue from 'vue';
import { Button, Select } from 'element-ui';
Vue.use(Button)
Vue.use(Select)
```

...当然还有很多，比如图片的懒加载、变量的本地化（避免重复访问）等
