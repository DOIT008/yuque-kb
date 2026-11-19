---
description: "基本结构含TS的组件的基本结构如下：          "
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ztr81a"
updated: "2023-02-02T06:24:34.000Z"
---

# TS+Vue3

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ztr81a)

::: info 本页结构
- 基本结构
- 代码示例
- 数据
- ref数据
- reactive数据
- props数据
- 计算属性
- methods
- Vuex
- 目录
:::

## 基本结构

含TS的组件的基本结构如下：

## 代码示例

```vue
<template>
  <div>

  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name:'xxx',
  setup () {
    return {}
  }
})
</script>

<style scoped>

</style>
```

> vscode 中在vue文件中输入vbase即可智能提示

**也可以使用**`**<script setup />**`

```vue
<template>
  <div>
  </div>
</template>

<script lang="ts" setup>
  import { defineComponent } from 'vue'
  // ....
</script>

<style scoped>
  
</style>
```

## 数据

## ref数据

由于ref数据一般而言都是**基础类型**的数据，所以，对于这种数据有如下几种声明方式：

```json
export default defineComponent({
  setup() {
    const isMan = ref<boolean>(true); // 明确指明类型
    const isMan1 = ref(true);// 采用类型断言
    const count = ref<number | string>(10); //可能有多种类型的情形
    return {
      isMan,
      isMan1,
      count
    };
  },
```

## reactive数据

reactive类型的数据一般用于定义复杂类型的数据（如对象，数组等），对于这种数据，**我们最好采用接口或者type，**例如：

```ts
import { ReacData } from "../types/types";// 定义接口，数据类型的文件
import { defineComponent, reactive, toRefs, ref } from "vue";
export default defineComponent({
  setup() {
    // reacData必须满足接口ReacData
    const reacData = reactive<ReacData>({
      msg: "hello,我来啦!",
      book: ["《红楼梦》", "《三国演义》", "《西游记》", "《水浒传》"],
      person: {
        name: "张三",
        age: 13,
        hobby: ["篮球", "足球", "乒乓球"],
      },
    });
    return {
      ...toRefs(reacData),
    };
  },
});
```

types.ts

```ts
// 接口 Person
export interface Person {
  name: string;
  age: number;
  hobby?: string[];
}
export interface ReacData {
  msg: string;
  book: string[];
  person: Person;
}
export interface Animal {
  skin: string;
  hobby: string[];
}
```

> 你会发现当你在修改上述数据的时候也只能修改成对应类型的值，否则就会报错

## props数据

通过props获取的数据也需要类型设置，对于基本类型的你只需要直接设置某个数据的`type`属性即可，对于对象类型的，如果还想让数据符合某个接口或者某种类型的数组等，你要使用vue的泛型`PropType`了，例如：

```vue
// dog.vue
<template>
  <div>
    {{ desc }}，我的名字是{{ name }}，我的毛是{{
      skin
    }}色的，我最喜欢干的事就是{{
      constru.hobby.join("，")
    }}，我最喜欢拆的地方是{{ chajia.join("，") }}
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from "vue";
interface Constru {
  head: string;
  leg: number;
  hobby: string[];
}
export default defineComponent({
  props: {
    skin: {
      type: String, // 基础类型直接指定type
      default: "",
      required: true,
    },
    name: {
      type: String,
      default: "旺财",
      required: true,
    },
    conStru: {// 复杂类型要使用PropType泛型
      type: Object as PropType<Constru>,
      required: true,
    },
    chajia: {// 同上
      type: Array as PropType<string[]>,
      required: true,
    },
  },
  setup() {
    const desc = ref<string>("我是一只可爱的小构");
    return { desc };
  },
});
</script>

<style scoped></style>

```

 

```vue
// Person.vue
 <dog
      skin="yellow"
      name="阿黄"
      :conStru="{ head: '头', leg: 4, hobby: ['拆家', '玩耍'] }"
      :chajia="['沙发', '床垫', 12]"
    ></dog>
```

## 计算属性

计算属性关心的是结果的数据类型，所以你要这样限定：

```js
// 计算属性，规定结果只能是字符串
    const msgPro = computed((): string => {
      return reacData.msg + "嘿嘿~";
    });
// 或者使用泛型
const double = computed<string>(() => {
  return reacData.msg + "嘿嘿~";
})
```

## methods

方法或者函数主要关心的点是参数的数据类型和返回值的数据类型（当然如果没有返回值其类型是`void`），所以一个典型的函数/方法的写法是：

```js
// 方法,定义第一个参数是number类型，第二个是string类型，有返回值string类型，当然参数后面也可能是一个接口
    const msgPro1 = function (pre: number, last: string): string {
      return `${pre}${reacData.msg}${last}!!!`;
    };
```

> 计算属性一般是不带参数的，其实上面也说明了，如果需要带参数，可以写一个方法去实现。

## Vuex

## 目录

![image.png](/images/852041b47f7c89c0.png)

## 基础模式

创建根State的数据类型，创建`store/interface.ts`

```ts

export interface RootStateTypes {
  count: number
} 
```

### useStore 组合式函数类型声明（简化版）

首先在src目录下创建一个`store`目录，然后再创建一个`index.ts`来作为Vuex的根State文件：

```ts
// index.ts（可作为模板文件）
import { InjectionKey } from 'vue'
import { createStore, useStore as baseUseStore, Store } from 'vuex'
import {RootStateTypes} from "./interface";
export const key: InjectionKey<Store<RootStateTypes>> = Symbol()

export const store = createStore<RootStateTypes>({
  state: {
    count: 0
  }
})

// 定义自己的 `useStore` 组合式函数
export function useStore () {
  return baseUseStore(key)
}
```

可能不太好懂，可以访问[官网的说明](https://next.vuex.vuejs.org/zh/guide/typescript-support.html#%E7%AE%80%E5%8C%96-usestore-%E7%94%A8%E6%B3%95)。

### 入口文件（main.ts）引入

```ts
import { createApp } from "vue";
import App from "./App.vue";
import "@/style/index.scss";
import { store, key } from "./store/index.ts";
const app = createApp(App);
app.use(store, key);
app.mount("#app");
```

### 在组件中访问

```vue
<template>
  <div>
    <h1>我是组件Common</h1>
    {{ count1 }}
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "../store/index";
export default defineComponent({
  setup() {
    const store = useStore();
    const count1 = computed(() => store.state.count);//一般在访问数据的时候都要转化成计算属性比较好 
    return {
      count1,
    };
  },
});
</script>

<style scoped></style>

```

> 你会发现上述在组件中访问`store.state.count`的时候，会出现提示并且也有数据类型

## 模块化

这个比较复杂，下面是一些模板案例，将来在做项目的时候就按照这个案例来就行啦：

### 一、定义子模块的数据类型

定义 子模块state 数据类型，在`store/modules/moduleA/interface.ts`中定义，如下所示，有两个字段 `greeting`， `sports`

```json
// 定义模块A的state类型
export default interface ModuleAStateTypes {
  greeting: string;
  sports: string[];
}

```

### 二、定义子模块

在`store/modules/moduleA/index.ts` 定义子模块，首先引入上述定义的子模块`state`的数据类型定义 `ModuleAStateTypes`，在我们引入vuex中的`Module` 子模块定义接口，传入参数，从vuex的源码中可查到，**第一个泛型参数为当前子模块的state类型定义, 第二个参数为根级state的类型定义**，只要定义了state的类型，在所有使用state的地方均会自动推断，不需要在定义。

```ts
import { Module } from "vuex"; // 引入vuex模块接口
import RootStateTypes from "../../interface"; // 引入根模块的state类型
import ModuleAStateTypes from "./interface"; // 引入当前模块的state类型

const moduleA: Module<ModuleAStateTypes, RootStateTypes> = {
  namespaced: true, // 使用命名空间
  state: {
    greeting: "哈喽，我来自ModuleA",
    sports: ["足球", "网球", "乒乓球"],
  },
  mutations: {
    addSport(state, sport: string) {
      state.sports.push(sport);
    },
  },
  getters:{},
  actions:{},
};
// 导出，以供在根State中使用
export default moduleA;
```

### 三、子模块集成(关键)

子模块引入使用，关键的一步，首先在 `store/interface.ts`中增加一个全量的state集成`AllStateTypes`，extends至根节点的`RootStateTypes`，将`moduleA`子模块的类型定义引入，并在该处定义便可，**这里的键** `**testModule**` **为接下来将在store/index.ts中引入的键定义**，如下图所示，新增类型定义，后续如果新增一个模块均在此全量的 `AllStateTypes` 新增便可。

```ts
// 引入模块A的类型定义
import ModuleAStateTypes from "./modules/moduleA/interface";

// 跟State的类型
export default interface RootStateTypes {
  count: number;
  message: string;
}

//vuex所有state类型集成
export interface AllStateTypes extends RootStateTypes {
  // 将来在组件中访问的时候就会以store.state.moduleA.xx访问，所以为了规范起见，最好还是以moduleA命名（和文件夹名一样）
  moduleA: ModuleAStateTypes;
}
```

### 四、在 `store/index.ts`中的处理

在modules中引入 `testModule`子模块，在 `baseUseStore` 中我们需要手动传入泛型`baseUseStore<AllStateTypes>(key)`，这样，项目中就能使用所有的状态数据不会提示报错也不要在每个地方定义了，当然，如下图所示，我们保留泛型的传入，将默认的类型定义为 `AllStateTypes` 也是可以的：

```ts
import { InjectionKey } from "vue";
import { createStore, useStore as baseUseStore, Store } from "vuex";
import RootStateTypes, { AllStateTypes } from "./interface";
// 引入moduleA
import moduleA from "./modules/moduleA/index";
export const key: InjectionKey<Store<RootStateTypes>> = Symbol();

export const store = createStore<RootStateTypes>({
  state: {
    count: 0,
    message: "hello,我来自Vuex",
  },
  mutations: {
    addOne(state): void {
      state.count++;
    },
  },
  actions:{
  		
  },
  getters:{
  },
  modules: {
    moduleA,//相当于moduleA:moduleA
  },
});

// 定义自己的 `useStore` 组合式函数
export function useStore<T = AllStateTypes>() {
  return baseUseStore<T>(key);
}

```

### 五、在组件中使用

还是以上面的`Person.vue`为例：

```vue
<template>
  <div>
    <h1>我是组件Common</h1>
    {{ count1 }}
    <h1>{{ greetings }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { useStore } from "../store/index";
export default defineComponent({
  setup() {
    const store = useStore();// 获取store对象
    const count1 = computed(() => store.state.count);//一般在访问数据的时候都要转化成计算属性比较好 
    const greetings = computed(() => store.state.moduleA.greeting); // 访问模块A的数据
    return {
      count1,
      greetings
    };
  },
});
</script>

<style scoped></style>
```

> 上述interface.ts主要是约束state数据的，对于mutations，actions，getters并不约束，所以这些选项该咋写咋写，当然啦，最好还是以TS的形式

## 路由

和之前总结的差不多，可以参考[路由](https://www.yuque.com/alipayqxigqpgusn/nv6oke/hy79uo#sYktv)

## 其他问题

1.  在路由文件中引入某个组件时报错：

![image.png](/images/edbb14a3cdd03cd8.png)

参考：[VSCode 中，TS 提示 ”无法找到 \*.vue 声明文件“ 的解决方案](https://zhuanlan.zhihu.com/p/415088917)

## 总结

在Vue+TS的结合中，要经常用到数据类型，这时候可以把各种类型的数据定义成接口和type并封装在一个个的类型文件中，养成这种习惯。

## 参考文章

1.  [Vue3拥抱TypeScript的正确姿势](https://juejin.cn/post/6875713523968802829#heading-3)
2.  [vuex4.0中使用typescript, vuex4.0中modules的ts使用](https://blog.csdn.net/fanweilin0123/article/details/109903447)
