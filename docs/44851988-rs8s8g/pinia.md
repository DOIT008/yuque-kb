---
description: "一、pinia是啥？跟Vuex差不多，一个状态管理工具，对TS的支持更好，除此之外还有其他特点：Vue2 和 Vue3 都能支持抛弃传统的 Mutation ，只有 state, getter 和 action ，简化状态管理库不需要嵌套模块，符合 Vue3 的 Composition api..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ggcgfrognuwukpmf"
updated: "2023-08-11T07:12:20.000Z"
---

# pinia

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ggcgfrognuwukpmf)

::: info 本页结构
- 一、pinia是啥？
- 二、怎么使用
- 2.1、安装
- 代码示例
- 2.2、使用
- 三、store之间的相互调用
- 四、持久化
- 四、插件
- 五、参考文章
:::

## 一、pinia是啥？

跟Vuex差不多，一个状态管理工具，对TS的支持更好，除此之外还有其他特点：

-   **Vue2 和 Vue3 都能支持**
-   **抛弃传统的 Mutation** ，只有 state, getter 和 action ，简化状态管理库
-   不需要嵌套模块，符合 Vue3 的 Composition api，让代码扁平化
-   **TypeScript支持**
-   代码简洁，很好的代码自动分割

## 二、怎么使用

### 2.1、安装

## 代码示例

```powershell
npm i pinia
```

挂载

```ts
// 引入pinia
import { createPinia } from 'pinia';
// 执行挂载进行实例化
const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
```

### 2.2、使用

创建store

```ts
import { defineStore } from "pinia";

export const mainStore = defineStore('main',{
  // 存放数据的地方
  state:()=>{
    return {
      count:12,
      msg:'哈喽，和pinia来一次亲密接触'
    }
  },
  // 计算属性
  getters:{
    dblDount(state){
      return state.count*2
    },
    msgLength(state){
      return state.msg.length
    }
  },
  // 修改数据
  actions:{
    changeMsg(){
      this.msg = '太爽了吧！'
    },
    changeCount(num:number){
      this.count = num
    }
  }
});
```

访问数据

```vue
<template>
  <div class="home">
    <el-container>
      <el-header class="header-wrapper">
        <div>
          Vue3+TS+ElememtPlus后台模板,{{ count }},{{ msg}},{{ msgLength }}
          <el-button plain type="primary" class="collapse-btn" @click="collapseClick">
            <el-icon>
              <Fold v-if="isCollapse" />
              <Expand v-else />
            </el-icon>
          </el-button>
        </div>
        <el-button link type="primary">退出</el-button>
      </el-header>
    </el-container>
  </div>
</template>

<script lang="ts" >
// 引入mainStore实例
import {mainStore} from '@/store/index';
// 响应式解构，不然的话数据没有响应式，无论是state还是getter都是这样
import { storeToRefs } from "pinia";
export default defineComponent({
  setup() {
    const store = mainStore();
    // 解构
    const { msg, count, msgLength, dblDount } = storeToRefs(store);
    function collapseClick(): void {
      
    }
    return {
      collapseClick,
       msg, 
      count,
      msgLength,
      dblDount
    };
  },
})
</script>

<style lang="scss" scoped>

</style>
```

修改数据

有两种方法，一种是在组件内部使用`$patch`，$patch 方法可以接受两个类型的参数，函数 和 对象：

-   **$patch + 对象**
-   **$patch + 函数：** 通过函数方式去使用的时候，函数接受一个 `state` 的参数，`state` 就是 `store` 仓库中的 `state`；
-   **直接调用**`**action**`**中的方法**

```vue
 function collapseClick(): void {
          // 传入对象
      store.$patch({
        count:store.count*4,
        msg:'太爽了吧！'
      })
      // 传入函数
      store.$patch((state)=>{
        state.count = state.count*4;
        state.msg = '太爽了吧！'
      })
    }
```

另一种是通过`actions`中配置的方法修改，也就是直接调用`collapseClick`方法：

```js
function collapseClick(): void {
      store.changeMsg();
      store.changeCount(19)
    }
```

## 三、store之间的相互调用

在 Pinia 中，可以在一个 store 中 import 另外一个 store ，然后通过调用引入 store 方法的形式，获取引入 store 的状态：

```ts
import { defineStore } from "pinia";

export const alinStore = defineStore('alin',{
  // 存放数据的地方
  state:()=>{
    return {
      books:['《西游记》','《红楼梦》',"《水浒传》","《三国演义》"]
    }
  },
  // 计算属性
  getters:{

  },
  actions:{

  }
});
```

 

```ts
import { defineStore } from "pinia";
// 引入其他store
import { alinStore } from "./alian";
export const mainStore = defineStore('main',{
  // 存放数据的地方
  state:()=>{
    return {
      count:12,
      msg:"哈喽"
    }
  },
  // 计算属性
  getters:{
    dblDount(state){
      return state.count*2
    },
    msgLength(state){
      return state.msg.length
    },
    // 获取alinStore上的数据
    allBooks(state):string[]{
      return alinStore().books
    }
  },
  actions:{
    changeMsg(){
      this.msg = '太爽了吧！'
    },
    changeCount(num:number){
      this.count = num
    }
  }
});
```

然后像其他`getter`正常访问即可

## 四、持久化

我们知道，`vuex`和`pinia`本质上都是对象，都是临时存储，当页面刷新数据都会丢失。

想要刷新不丢失就需要我们手动存储在`localStorage`或`sessionStorage`里面。如果不想手动处理，我们也可以使用插件。

vuex使用[vuex-persistedstate](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Frobinvdvleuten%2Fvuex-persistedstate)

pinia使用[pinia-plugin-persistedstate](https://link.juejin.cn?target=https%3A%2F%2Fgithub.com%2Fprazdevs%2Fpinia-plugin-persistedstate)

```js
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia().use(piniaPluginPersistedstate))

app.mount('#app')

```

## 四、插件

参考[官网](https://pinia.web3doc.top/core-concepts/plugins.html)

## 五、参考文章

1.  [大菠萝？Pinia已经来了，再不学你就out了](https://juejin.cn/post/7078281612013764616#heading-10)
2.  [Vuex4 对 TypeScript 并不友好，所以我选择 Pinia](https://zhuanlan.zhihu.com/p/413389658)
3.  [pinia ts下的对象类型标注](https://blog.csdn.net/lsjweiyi/article/details/124128082)
