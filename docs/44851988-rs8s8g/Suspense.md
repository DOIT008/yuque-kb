---
description: "每当我们希望组件等待数据获取时（通常在异步API调用中），我们都可以使用Vue3 Composition API制作异步组件。以下是异步组件有用的一些实例：在页面加载之前显示加载动画显示占位符内容处理延迟加载的图像以前，在Vue 2中，我们必须使用条件（例如 v-if 或 v-else）来检查..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/kvbvya"
updated: "2021-06-17T13:56:35.000Z"
---

# Suspense

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/kvbvya)

::: info 本页结构
- 先举个栗子吧
- 代码示例
- 再举个栗子👧
- 参考文章
:::

每当我们希望组件等待数据获取时（通常在异步API调用中），我们都可以使用Vue3 Composition API制作异步组件。

以下是异步组件有用的一些实例：

-   在页面加载之前显示加载动画
-   显示占位符内容
-   处理延迟加载的图像

以前，在Vue 2中，我们必须使用条件（例如 v-if 或 v-else）来检查我们的数据是否已加载并显示后备内容。

但是现在，Suspense随Vue3内置了，因此我们不必担心跟踪何时加载数据并呈现相应的内容。

> 不过到目前为止，这个组件好像是一个实验性的组件，以后的API可能会变。

## 先举个栗子吧

先定义一个组件BookList.vue，组件中的数据是异步获取的：

## 代码示例

```vue
<template>
  <div>
    <ul>
      <li v-for="(book, index) in bookList" :key="index">
        {{ book.author }}---{{ book.bookName }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref, reactive, toRefs } from "vue";
export default {
  async setup() {
    let data = reactive({
      bookList: [],
    });

    // 定义异步加载数据;
    function loadBookList() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          let _bookList = [
            {
              author: "吴承恩",
              bookName: "《西游记》",
            },
            {
              author: "曹雪芹",
              bookName: "《红楼梦》",
            },
            {
              author: "施耐庵",
              bookName: "《水浒传》",
            },
          ];
          resolve(_bookList);
        }, 5000);
      });
    }

    // 加载数据
    data.bookList = await loadBookList();
    return {
      ...toRefs(data),
    };
  },
};
</script>

<style lang="scss" scoped></style>

```

使用`<template>`里使用了`<Suspense>`标签，即便你完全不懂`<Suspense>`的用法，看了范例也该看明白，`**default**`**插槽里要放正式内容，**`**fallback**`**插槽里要放降级内容，我放了一行字**`**加载中 ...**`**，你也可以放菊花图之类的东西。**

```vue
<template>
  <div class="container">
    <div v-if="showError"></div>
    <Suspense v-else>
      <template #default>
        <book-list></book-list>
      </template>
      <template #fallback> 加载中.... </template>
    </Suspense>
  </div>
</template>

<script>
import BookList from "/@/components/BookList.vue";
import { ref, computed, reactive, toRefs, onErrorCaptured } from "vue";
export default {
  name: "HelloWorld",
  setup() {
    let showError = ref(false);
    // 处理异常
    onErrorCaptured((e) => {
      showError.value = true;
    });
  
    return {
      showError,
    };
  },
  components: {
    BookList,
  },
};
</script>
<style lang="scss"></style>

```

你会发现在刚开始的时候显示`加载中...`，5s后内容变成了一个列表。

## 再举个栗子👧

在这个例子中，我们将进行一次真实的请求，包括跨域的配置，渲染一个笑话列表：

首先我们要创建一个组件，Jokes.vue

```vue
<template>
  <div>
    大家好，我是来自华府的{{ girl.name }}，我今年{{
      girl.age
    }}岁了,下面是我给大家准备的笑话，请欣赏：
  </div>
  <ul>
    <li v-for="(item, index) in jokesList" :key="index">{{ item.content }}</li>
  </ul>
</template>

<script lang="ts">
// 使用ts推荐这样的结构
import { defineComponent, onErrorCaptured, reactive, toRefs } from "vue";
import axios from "axios";
export default defineComponent({
  async setup() {
    const data = reactive({
      girl: {
        name: "秋香",
        age: 23,
      },
      jokesList: [],
    });
    // 捕获异常,举例
    onErrorCaptured((error) => {
      console.log(error);
      return;
    });
    // 请求数据
    function getData() {
      return axios.get("/common/joke/getJokesByRandom", {
        params: {
          apiKey: "l3PwyJebc561bbcaa6c367c7cf6a67404b9644b35aec834",
          pageSize: 10,
        },
      });
    }
    // 执行
    let res = await getData();
    // 赋值
    data.jokesList = res.data.result;
    return {
      ...toRefs(data),
    };
  },
});
</script>

<style scoped></style>

```

在HelloWorld.vue中使用：

```vue
<template>
  <div class="container">
    <Suspense>
      <template #default>
        <Jokes />
      </template>
      <template #fallback> 笑话马上就来.... </template>
    </Suspense>
  </div>
</template>

<script>

import Jokes from "/@/components/Jokes.vue";
export default {
  name: "HelloWorld",
  setup() {

  },
  components: {
    Jokes,
  },
};
</script>
<style lang="scss"></style>

```

然后在刷新界面的时候，你会发现会闪一下“笑话马上就来....”，等到接口数据返回，就开始渲染了。

下面是配置文件的部分代码：

vite.config.js

```js
const path = require("path");
export default {
  alias: {
    "/@/": path.resolve(__dirname, "src"), // 根目录下的src目录
  },
  // 配置跨域代理
  proxy: {
    "/common": {
      target: "https://api.apishop.net/",//表示如果url遇到/common，就会将/common前面的部分替换成target
      changeOrigin: true,
      // 涉及到重写，也就是说可能我们发送的请求url和真正的请求url，标识符有所差别，不过一般不用重写吧
      rewrite: (path) => path.replace(/^\/common/, "/common"),
    },
  },
};

```

## 参考文章

1.  [Vue 3新引入的Suspense组件介绍](https://www.jianshu.com/p/4bc2dfba1ffd)
2.  [Vue.js 3.0的Suspense组件简介](http://blog.yixao.net/share/12767.html)​

  

​
