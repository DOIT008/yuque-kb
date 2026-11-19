---
description: "一般而言如果要想在组件间共享数据，我们首先想到的恐怕就是Vuex，可就像Vue官网上说的那样--Vuex一般用在大型项目上，如果在小项目上使用Vuex就有点大才小用了🤣，那么在小项目上有没有类似Vuex的东西呢？当然是有的，这就是我们今天要说的主题--Vue.observable。Vue.o..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/hreozh"
updated: "2024-07-23T13:38:51.000Z"
---

# Vue.observable的使用

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/hreozh)

## 背景与思路

![timg.png](https://cdn.nlark.com/yuque/0/2020/png/1528528/1593955684687-4c39728b-e33c-492f-8cf8-46ddb11b89f4.png)

一般而言如果要想在组件间共享数据，我们首先想到的恐怕就是Vuex，可就像Vue官网上说的那样--Vuex一般用在大型项目上，如果在小项目上使用Vuex就有点大才小用了🤣，那么在小项目上有没有类似Vuex的东西呢？

当然是有的，这就是我们今天要说的主题--Vue.observable。

> Vue.obserable在2.6以上的版本才有

话不多说，直接上代码~

1.  新建 `miniStore.js` 作为存储数据的公共方法。

## 代码示例

```js
import Vue from "vue";
// 使用Vue.observable监控数据，并将其处理成相应式的数据
export const miniStore = Vue.observable({
  name: "张三",
  age: 23,
  hobby: ["篮球", "听音乐", "看电影"]
});
// 定义改变数据的方法
export const miniMutation = {
  setName(name) {
    miniStore.name = name;
  },
  setAge(age) {
    miniStore.age = age;
  }
};

```

2.  在 `Home` 组件上引入该 `miniStore.js` 

```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" @click="handleClick" />

    <h1>{{ pName }}</h1>
    <h1>{{ pAge }}</h1>
    <button @click="setName('里斯')">修改名字</button>
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
// 引入miniStore
import { miniStore, miniMutation } from "../store/miniStore";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  methods: {
    handleClick() {
      console.log("clicked!!");
    },
    // 重新赋值操作，引用miniStore中已经定义好的方法
    setName: miniMutation.setName,
    setAge: miniMutation.setAge
  },
  computed: {
    // 使用计算属性拿到miniStore.name的值
    pName() {
      return miniStore.name;
    },
    // 同上
    pAge() {
      return miniStore.age;
    }
  },
  watch: {
    // watch监控数据的变化
    pName(newVal, oldVal) {
      console.log(newVal, oldVal);
    }
  }
};
</script>

```

3.  在 `About` 组件上引入该 `miniStore.js`

```vue
<template>
  <div class="about">
    <h1>This is an about page</h1>
    <!-- 使用数据 -->
    <h1>{{ sName }}</h1>
    <h1>{{ sAge }}</h1>
  </div>
</template>
<script>
import { miniStore } from "../store/miniStore";
export default {
  computed: {
    // 拿到miniStore的数据
    sName() {
      return miniStore.name;
    },
    sAge() {
      return miniStore.age;
    }
  }
};
</script>

```

其实一路走下来，**你就会发现Vue.obserable很像一个mini的Vue，各方面使用都有Vuex的影子，包括数据的使用，数据的处理（****不能在组件内直接改变****）****等。**
