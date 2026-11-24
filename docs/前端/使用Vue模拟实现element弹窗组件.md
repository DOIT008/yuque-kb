---
description: "以前我们在使用组件的时候都是先用import引入，然后在components注册，最后才能使用，这是我们通常的做法。但渐渐的你会发现我们在使用Element开发业务的时候，经常会使用一个函数就能动态的生成一个组件，比如弹窗组件，人家用一行代码就能生成一个组件并渲染出来this.$ messag..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qg8b8r"
updated: "2020-07-19T01:30:36.000Z"
---

# 使用Vue模拟实现element弹窗组件

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qg8b8r)

<details class="toc-details">
<summary>本页结构（3 个小节）</summary>

- 代码示例
- 思路总结
- 参考文章

</details>

![timg.png](/images/d4fabc5a6f17ac10.png)

以前我们在使用组件的时候都是先用import引入，然后在components注册，最后才能使用，这是我们通常的做法。

但渐渐的你会发现

我们在使用Element开发业务的时候，经常会使用一个函数就能动态的生成一个组件，比如弹窗组件，人家用一行代码就能生成一个组件并渲染出来this.$ message(配置对象)，总是很好奇他们究竟是怎样实现的，让我们来一探究竟吧。

  

> 官网：使用基础 Vue 构造器，创建一个“子类”。参数是一个包含组件选项的对象（不就是某个.vue文件嘛）

  

其实看了他们的源码才发现，他们使用了一个Api: `Vue. extend` 来创建一个子类，然后结合 `$mount` 挂载到 `body` 底部，直接上代码：

1.  message.vue

## 代码示例

```vue
<template>
  <div class="messagebox">{{ content }}</div>
</template>

<style lang="less">
.messagebox {
  width: 200px;
  height: 100px;
  text-align: center;
  position: absolute;
  top: 50px;
  left: 50%;
  border: 1px solid #ccc;
  box-shadow: 1px 1px 2px #ccc;
  background: green;
}
</style>

```

2.  index.js

```js
import Vue from "vue";
import message from "./message.vue";
// 导出一个函数
export default function(option) {
  // 1. 使用Vue.extend生成一个message的子类(构造函数)
  const Instance = Vue.extend(message);
  // 2. 使用new生成一个实例，这个只是一个vnode
  const instance = new Instance({
    // 可能还有很多组件选项，data必须是函数
    data() {
      return {
        content: option.text,
        timeout: option.timeout
      };
    }
  });
  // 通过挂载生成真实的dom
  let messageIndex = instance.$mount();
  //将DOM添加到body的最后一个元苏上
  document.body.appendChild(messageIndex.$el);
  //一段时间后从body中清除
  setTimeout(() => {
    document.body.removeChild(messageIndex.$el);
  }, option.timeout);
}

```

3.  main.js(入口文件)

```js
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
// 引入该方法
import createMessage from "./components/message/index";
Vue.config.productionTip = false;
// 注册为全局方法
Vue.prototype.$messageBox = createMessage;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

```

4.  在组件中使用

```vue
<template>
  <div>
    <button @click="showMsgBox">弹窗实验</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isShow: false
    };
  },
  methods: {
    showMsgBox() {
      this.$messageBox({
        text: "哈喽，我出来啦",
        timeout: 2000
      });
    }
  }
};
</script>

```

效果图

![2020-07-16_223052.png](/images/c4f6af2bcb8c262a.png)

2秒后消失

## 思路总结

1.  首先要写一个组件 `message.vue` ，作为模板组件
2.  使用 `Vue.extend()` 并将上面的 `message` 组件配置对象作为参数传进去，生成一个构造函数
3.  使用 `new`  将上面的构造函数生成一个实例，并将 `option` 参数传进去，里面有 `data` 选项
4.  上一步只是生成了一个 `VNode` ，要想拿到真正的DOM，还必须挂载 `$mount()` ，
5.  将DOM（ `$el` ）添加到 `body` 的后面，并根据 `timeout` ，定时清除该DOM

## 参考文章

1.  [带你徒手撸一个toast组件](https://juejin.im/post/5af55f906fb9a07aae153c1c)
2.  [Vue.extend官网](https://cn.vuejs.org/v2/api/#Vue-extend)
