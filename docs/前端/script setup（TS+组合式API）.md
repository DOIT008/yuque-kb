---
description: "啥意思 其实就是换了一种写js的方式，原来我们写js代码都是在setup函数中写的，现在可以直接在script标签中写了(只不过要加一个setup属性)，写法也可能有不一样的地方，不过总体而言还是比较方便的，例如：   测试setup script的写法"
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uqybgq"
updated: "2024-02-23T07:23:37.000Z"
---

# script setup（TS+组合式API）

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uqybgq)

<details class="toc-details">
<summary>本页结构（22 个小节）</summary>

- 啥意思
- 代码示例
- 不一样的地方
- 一、组件相关
- 1\. 直接使用组件
- 2\. 动态组件
- 二、数据
- 1\. reactive数据
- 2\. ref数据
- 三、指令

</details>

## 啥意思

其实就是换了一种写js的方式，原来我们写js代码都是在`setup`函数中写的，现在可以直接在`script`标签中写了(只不过要加一个`setup`属性)，写法也可能有不一样的地方，不过总体而言还是比较方便的，例如：

## 代码示例

```vue
<template>
  <div>测试setup script的写法</div>
  <HelloWorld></HelloWorld>
</template>

<script setup>
// 直接写js代码，包括方法的定义，数据的定义等
import HelloWorld from "components/HelloWorld.vue";
import { reactive, defineProps, toRefs } from "vue";
</script>

<style lang="scss" scoped></style>
```

## 不一样的地方

## 一、组件相关

### 1\. 直接使用组件

原来我们使用组件的时候，使用`import`引用过来以后还要在`components`选项中进行注册才行，现在不用了，引用过来以后直接使用即可，就像上面的HelloWorld组件。

### 2\. 动态组件

由于组件被引用为变量而不是作为字符串键来注册的，在 `<script setup>` 中要使用动态组件的时候，就应该使用动态的 `:is` 来绑定：

```vue
<script setup>
import Foo from './Foo.vue'
import Bar from './Bar.vue'
</script>

<template>
  <component :is="Foo" />
  <component :is="someCondition ? Foo : Bar" />
</template>
```

## 二、数据

### 1\. reactive数据

定义的时候和经典的写法差不多，只不过使用的时候只能通过访问数据属性的方式来使用，不能使用`toRefs`了，例如：

```vue
<template>
  <div>
    <!-- 访问数据的时候智能是reacData.xx -->
    <h1>{{ reacData.msg }}</h1>
    大家好，我是{{ reacData.person.name }},我今年{{ reacData.person.age }}岁了，
    <ul>
      <li v-for="(item, index) in reacData.books" :key="index">{{ item }}</li>
    </ul>
    <button @click="changeMsg()">改变msg</button>
  </div>
</template>

<script setup>
import { reactive} from "vue";
const reacData = reactive({
  msg: "我是about组件",
  person: {
    name: "张三",
    age: 18,
  },
  books: ["《三国演义》", "《水浒传》", "《红楼梦》", "《西游记》"],
});
  // 定义方法改变reacData中的数据
const changeMsg = () => {
  reacData.msg = "我还是about组件，但我想换一种方式来打招呼！";
};
 // 生命周期中访问reacData
onMounted(() => {
  console.log(reacData.msg);
});
</script>
```

### 2\. ref数据

其实和以前差不多

```vue
<template>
  <div>
    <h1>{{ refData }}</h1>
     <button @click="changeRefData()">改变ref数据</button>
  </div>
</template>

<script setup>
  import { reactive,ref} from "vue";
  //改变数据时其实改变的是value
  const changeRefData = () => {
    refData.value = "我是变了心的ref数据";
  };
  // 生命周期中访问ref数据，还是访问value
  onMounted(() => {
    console.log(refData.value);
  });
</script>
```

## 三、指令

必须以 `vNameOfDirective` 的形式来命名本地自定义指令，以使得它们可以直接在模板中使用。

```vue
<script setup>
const vMyDirective = {
  beforeMount: (el) => {
    // 在元素上做些操作
  }
}
</script>
<template>
  <h1 v-my-directive>This is a Heading</h1>
</template>
```

 

```vue
<script setup>
  // 导入的指令同样能够工作，并且能够通过重命名来使其符合命名规范
  import { myDirective as vMyDirective } from './MyDirective.js'
</script>
```

## 四、通信

### 1\. prop数据defineProps

父组件其实和之前的差不多，就是在子组件内部接收的时候有区别，要用到`defineProps`方法，例如：

父组件about.vue

```vue
<template>
	<HelloWorld :message="reacData.propMessage"></HelloWorld>
</template>
<script setup >
  import HelloWorld from "components/HelloWorld.vue";
	const reacData = reactive({
 		 propMessage: "来自父组件about.vue的问候",
	});
</script>
```

子组件HelloWorld.vue

```vue
<template>
  <div>
    {{ data.msg }}
    <h3>{{ message }}</h3>
  </div>
</template>

<script setup>
import { reactive, ref, defineProps } from "vue";
// 数据
const data = reactive({
  msg: "我来自组件HelloWorld",
});
// 可以是数组，也可以是对象
const props = defineProps(["message"]);
// props.message 访问数据
const props = defineProps({
  message: {
    type: String,
    default: "我是默认的啦",
    required:true
  },
});
// 也可以使用泛型
interface Message {
  message:string
}
const props = defineProps<Message>();
</script>

<style lang="scss" scoped></style>

```

### 2\. 自定义事件defineEmits

我们知道自定义事件一般是用来将子组件的数据传递给父组件的，那么在这种模式下改如何去做呢？。

**使用defineEmits的返回值**

`defineEmits`是一个函数，它其实是定义了自定义事件的事件名集合，里面可以传数组，也可以传对象（可以进行事件的相关校验），**相当于原来的emits选项，**例如：

```vue
//子组件 HelloWorld.vue
<template>
  <div>
    // 这里的emit来源于下方定义的emit那个变量
    <button @click="emit('testMsg', data.emitData)">测试emit方法</button>
  </div>
</template>

<script setup>
import { reactive, ref, defineProps, defineEmits } from "vue";
// 数据
const data = reactive({
  msg: "我来自组件HelloWorld",
  emitData: "能传送过来吗",
});

// 声明自定义事件，可以接收字符串，也可以接收对象进行校验，相当于原来的emits选项
const emit = defineEmits(["testMsg"]);

</script>

<style lang="scss" scoped></style>

```

 

```vue
// 父组件 about.vue
<template>
  
  <HelloWorld
    :message="reacData.propMessage"
    @testMsg="handleCallback"
  ></HelloWorld>
</template>

<script setup>
// 直接写js代码，包括方法的定义，数据的定义等
import HelloWorld from "components/HelloWorld.vue";
import { reactive} from "vue";

// 数据
const reacData = reactive({
  emitPayload: "",
});

// 方法或函数
const handleCallback = (payload) => {
  reacData.emitPayload = payload;
};
</script>

<style lang="scss" scoped></style>

```

### 3\. 在typeScript中的应用

那么问题来了，如何在TS中使用上述两个语法呢？

```ts
// 导入 defineProps 组件
import { defineProps } from 'vue'

// 对象类型接口
interface UserInfo {
  id: number
  age: number
}

// 定义 props
const propData = defineProps<{
  name: string
  phoneNumber: number
  userInfo: UserInfo
  tags: string[]
}>()

// 定义Emits
const emit = defineEmits<{
  (e: 'change', id: number): void // 这里的change就是自定义事件名
  (e: 'update', value: string): void // 同上
}>()
```

在有时候，`props`数据都是有默认值的，那么在TS的时候怎么定义默认值呢？这就需要用到`withDefaults` 编译器宏了:

```ts
interface Props {
  msg?: string
  labels?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  msg: 'hello',
  labels: () => ['one', 'two']
})
```

## 五、其他API

### 1\. defineExpose

一般而言，一个组件内定义的方法都是给自己用的，但如果我们想在父组件调用子组件内的方法，但有些方法或者数据又不想被访问到，该咋办呢？这里就用到`defineExpose`方法了，举个例子：

```vue
// 子组件 HelloWorld.vue
<template>
  <div>
    {{ data.msg }}
  </div>
</template>

<script setup>
import { reactive, ref, defineProps, defineEmit, defineExpose } from "vue";
// 数据
const data = reactive({
  msg: "我来自组件HelloWorld",
  heihei: "嘿嘿~~",
});
  
defineExpose({
  // 暴露出一个方法
  someMethod() {
    console.log(data.msg);
  },
  // 暴露出一个属性
  heihei: data.heihei,
});

</script>

<style lang="scss" scoped></style>
```

 

```vue
// 父组件 about.vue
<template>
  <div>
    <button @click="getExposeData()">访问组件HelloWorld暴露出来的内容</button>
  </div>
	// 有没有想起vue2.x中的ref?😄,那时候是this.$refs.Hello.xx
  <HelloWorld
    ref="Hello"
  ></HelloWorld>
</template>

<script setup>
// 直接写js代码，包括方法的定义，数据的定义等
import HelloWorld from "components/HelloWorld.vue";
import { reactive, defineProps, ref, onMounted } from "vue";
const Hello = ref(null); // 变量名必须是Hello，和上面的ref属性保持一致
const getExposeData = () => {
  // 暴露出的内容都在Hello的value属性上
  Hello.value.someMethod();
  console.log(Hello.value.heihei);
};
</script>
<style lang="scss" scoped></style>

```

**其实还有一种方法，就是使用**`**ref**`**，通过给组件实例添加**`**ref**`**属性来拿到子组件的实例，或者使用**`**$parent**`**来访问父组件。**

### 2\. useSlots和useAttrs

在 `<script setup>` 使用 `slots` 和 `attrs` 的情况应该是很罕见的，因为可以在模板中通过 `$slots` 和 `$attrs` 来访问它们。在你的确需要使用它们的罕见场景中，可以分别用 `useSlots` 和 `useAttrs` 两个辅助函数：

```vue
<script setup>
import { useSlots, useAttrs } from 'vue'

const slots = useSlots()
const attrs = useAttrs()
</script>
```

它会返回与 `setupContext.slots` 和 `setupContext.attrs` 等价的值，同样也能在普通的组合式 API 中使用。说白了和这个一样：

```vue
<script>
  setup(props, context){
    const slots = context.slots
    const attrs = context.attrs
  }
</script>
```

## 六、为事件处理函数标注类型

在处理原生 DOM 事件时，应该为我们传递给事件处理函数的参数正确地标注类型。让我们看一下这个例子：

```html
<script setup lang="ts">
function handleChange(event) {
  // `event` 隐式地标注为 `any` 类型
  console.log(event.target.value)
}
</script>

<template>
  <input type="text" @change="handleChange" />
</template>

```

没有类型标注时，这个 event 参数会隐式地标注为 `any` 类型。这也会在 `tsconfig.json` 中配置了 `"strict": true` 或 `"noImplicitAny": true` 时报出一个 TS 错误。因此，**建议显式地为事件处理函数的参数标注类型**。此外，你可能需要显式地强制转换 `event` 上的属性：

```js
function handleChange(event: Event) {
  console.log((event.target as HTMLInputElement).value)
}
```

## 七、模板标注类型

模板引用需要通过一个显式指定的泛型参数和一个初始值 null 来创建：

```html
<script setup lang="ts">
import { ref, onMounted } from 'vue'
const el = ref<HTMLInputElement | null>(null)
onMounted(() => {
  el.value?.focus()
})
</script>

<template>
  <input ref="el" />
</template>

```

注意为了严格的类型安全，有必要在访问 `el.value` 时使用可选链或类型守卫。这是因为直到组件被挂载前，这个 `ref` 的值都是初始的 `null`，并且在由于 `v-if` 的行为将引用的元素卸载时也可以被设置为 `null`。

## 八、为组件模板引用标注类型

有时，你可能需要为一个子组件添加一个模板引用，以便调用它公开的方法。举例来说，我们有一个 `MyModal`子组件，它有一个打开模态框的方法：

```html
<!-- MyModal.vue -->
<script setup lang="ts">
import { ref } from 'vue'

const isContentShown = ref(false)
  // 打开模态框
const open = () => (isContentShown.value = true)

defineExpose({
  open
})
</script>

```

为了获取 `MyModal` 的类型，我们首先需要通过 `typeof` 得到其类型，再使用 TypeScript 内置的 `InstanceType` 工具类型来获取其实例类型：

```html
<!-- App.vue -->
<script setup lang="ts">
import MyModal from './MyModal.vue'

const modal = ref<InstanceType<typeof MyModal> | null>(null)

const openModal = () => {
  modal.value?.open()
}
</script>

```

## 九、总结

其实这种写法只能算是锦上添花，没必要非得这样写，其实在实际的项目中我们更多的应该是使用[这种方式](https://www.yuque.com/alipayqxigqpgusn/nv6oke/ztr81a)。

## 十、参考文章

1.  [vue3：语法糖内的defineProps及defineEmits、defineExpose](https://blog.csdn.net/skyblacktoday/article/details/120879677)
2.  [defineProps和defineEmits（官方文档）](https://v3.cn.vuejs.org/api/sfc-script-setup.html#defineprops-%E5%92%8C-defineemits)
3.  [Vue3.0最新动态：script-setup定稿 部分实验性API将弃用](https://zhuanlan.zhihu.com/p/386919557)​
