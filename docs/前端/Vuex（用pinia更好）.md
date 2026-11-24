---
description: "其实Vue3.x中的Vuex和Vue2差不多，还是分为state，getters，mutations，actions，module，但是写法却有些许差别，先看官方建议的Vuex解构吧：安装npm i vuex@next -S举个例子下面的例子都是根据上面的目录做的，单本质是不变的。index...."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/hl8lir"
updated: "2023-01-16T10:44:22.000Z"
---

# Vuex（用pinia更好）

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/hl8lir)

<details class="toc-details">
<summary>本页结构（14 个小节）</summary>

- 安装
- 代码示例
- 举个例子
- 各个选项
- state
- mutations
- getters
- actions
- modules
- 在组件中使用

</details>

其实Vue3.x中的Vuex和Vue2差不多，还是分为`state`，`getters`，`mutations`，`actions`，`module`，但是写法却有些许差别，先看官方建议的Vuex解构吧：

![2021-06-03_202826.png](/images/4acef3497f88b725.png)

## 安装

## 代码示例

```json
npm i vuex@next -S
```

## 举个例子

下面的例子都是根据上面的目录做的，单本质是不变的。

index.js

```js
import { createStore } from "vuex";
import state from "./state.js";
import getters from "./getters.js";
import mutations from "./mutations.js";
import actions from "./actions.js";
// 创建store实例
const store = createStore({
  state,
  getters,
  mutations,
  actions,
});
// 导出store实例
export default store;
```

main.js(入口文件)

```js
import { createApp } from "vue"; // 引入createApp函数
import App from "./App.vue"; // 其实其实就是一个对象
import "./index.css";
import store from "./store/index.js";
// 执行挂载进行实例化
const app = createApp(App);
// 作为插件使用
app.use(store);

app.mount("#app");
```

## 各个选项

以下的说明是针对上述的结构目录进行的，当然你也可以把所有的选项都直接写在`index.js`里，但是本质是不变的。

### state

存储数据的地方，可以数一个函数，也可以是一个对象。

```js
// state.js
export default function state() {
  return {
    message: "我来自Vuex12",
    userInfo: {
      name: "张三",
      age: 14,
    },
  };
}
```

### mutations

改变`state`数据的地方，在组件中需要`commit`某个`mutation`。

```js
// mutations.js
export default {
  // 将来要commit这个函数才能改变state中的数据
  changeMessage(state, str) {
    state.message += str;
  },
};

```

### getters

在某种程度上相当于计算属性，可以对state中某些数据进行格式化处理。

```js
// getters.js
export default {
  getterMessage: (state) => {
    return state.message + "，当然，我是经过了getter的处理";
  },
};

```

### actions

可以`commit`某个`mutation`，也可以进行异步处理。

```js
export default {
	
};
```

### modules

分模块，每隔模块都是一个完整的store对象

```js
// moduleA.js
export default {
  state: {
    message: "我是来自moduleA的数据",
  },
  getters: {
    moduleAMsgGetter(state) {
      return state.message + ",getter格式化后的数据";
    },
  },
  mutations: {
    changeMessage1(state, payload) {
      state.message = "我是改变后的message！";
    },
  },
};

```

index.js进行改写

```js
import { createStore } from "vuex";
import state from "./state.js";
import getters from "./getters.js";
import mutations from "./mutations.js";
import actions from "./actions.js";
import moduleA from "./module/moduleA.js";
// 创建store实例
const store = createStore({
  state,
  getters,
  mutations,
  actions,
  // 模块化
  modules: {
    a: moduleA,
  },
});

export default store;

```

## 在组件中使用

### 访问全局Store

son.vue

```vue
<template>
  <div>{{ value }}</div>
  <h1>大家好我是{{ localUserInfo.name }},我今年{{ localUserInfo.age }}岁了</h1>
  <h1>{{ getterData }}</h1>
  <br />
  <button @click="changeVuexData">改变Vuex数据</button>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex"; // 要用到useStore，所以先引入
export default {
  name: "son",
  props: {
    value: String,
  },
  setup(props, { emit }) {
    // 获取store对象
    const store = useStore();
    // 定义方法commit某个 mutation，和Vue2差不多
    function changeVuexData() {
      store.commit("changeMessage", "我是改变后的Vuex数据");
    }
    const getterData = computed(() => store.getters.getterMessage); //获取getter数据
    const localMessage = computed(() => store.state.message); // 获取state数据
    const localUserInfo = computed(() => store.state.userInfo); // 获取state数据

    return {
      // 获取state中的数据
      localUserInfo,
      localMessage,
      // 获取getters数据
      getterData,
      changeVuexData,
    };
  },
};
</script>

<style lang="scss" scoped></style>

```

### 访问模块化的Store

```vue
<template>
  <h2>{{ moduleAMsg }}</h2>
  <h2>{{ moduleAgetter }}</h2>
  <button @click="changeModuleVuexData">改变Vuex数据</button>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex"; // 要用到useStore，所以先引入
export default {
  name: "son",
  setup(props, { emit }) {
    // 获取store对象
    const store = useStore();
    // 访问模块化的mutation，全局的？
    function changeModuleVuexData() {
      store.commit("changeMessage1");
    }

    // 模块化的state数据
    const moduleAMsg = computed(() => store.state.a.message);
    // getter全局访问
    const moduleAgetter = computed(() => {
      return store.getters.moduleAMsgGetter;
    });

    return {
      moduleAMsg,
      moduleAgetter,
      changeModuleVuexData,
    };
  },
};
</script>
```

### 命名空间

虽然进行了模块化处理，但是在某种程度上来说依然有问题——模块内的`getter`,`mutation`依然是注册在了全局(从上面的例子就可以看出)，这样如果共享数据比较多就很容易相互污染，所以最好要这些模块进行隔离，这就需要用到命名空间。

#### 方法

在模块store对象添加选项`namespaced:true`，例如：

moduleA.js

```js
export default {
  // 命名空间
  namespaced: true,
  state: {
    message: "我是来自moduleA的数据",
  },
  getters: {
    moduleAMsgGetter(state) {
      return state.message + ",getter格式化后的数据";
    },
  },
  mutations: {
    changeMessage1(state, payload) {
      state.message = "我是改变后的message！";
    },
  },
};

```

#### 组件内使用

```js
		// 模块化的数据，还是一样
    const moduleAMsg = computed(() => store.state.a.message);
    // 访问getter的时候需要store.getters["模块名/getter名"]
    const moduleAgetter = computed(() => {
      return store.getters["a/moduleAMsgGetter"];
    });
		// 访问带命名空间的模块化的mutation
    function changeModuleVuexData() {
      store.commit("a/changeMessage1");
    }
```

## 简写

但是如果一直这么写可能还是有点麻烦，有没有更简单的方法呢？当然是有的，那就是使用`mapState`，`mapMutaions`，`mapActions`等，如果真想使用参考[这篇文章](https://blog.csdn.net/qq_16139383/article/details/119935755)，但是在Vue3中如果使用CompositionAPI，用这个反而比较麻烦，所以就不说了，如果真的想使用，那还是使用OptionAPI吧！

1.  [Vuex官网](https://next.vuex.vuejs.org/zh/guide/state.html)​
