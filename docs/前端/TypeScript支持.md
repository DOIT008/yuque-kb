---
description: "由于Vue3本身就是用TS写的，所以在写Vue3的项目的时候推荐使用TS，不仅仅是因为它好用，而且还是因为这是趋势，那么如何才能让创建的项目支持TS呢，我们需要做哪些工作呢？全局ts配置需要在项目根目录下创建ts的配置文件，以下是官网推荐的tsconfig.json配置// tsconfig...."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/zba755"
updated: "2023-08-01T07:09:40.000Z"
---

# TypeScript支持

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/zba755)

<details class="toc-details">
<summary>本页结构（12 个小节）</summary>

- 全局ts配置
- 代码示例
- 创建项目
- Vite
- vue-cli
- webpack
- 组件相关
- 规范数据
- 注解Props
- 注解ref

</details>

由于Vue3本身就是用TS写的，所以在写Vue3的项目的时候推荐使用TS，不仅仅是因为它好用，而且还是因为这是趋势，那么如何才能让创建的项目支持TS呢，我们需要做哪些工作呢？

## 全局ts配置

需要在项目根目录下创建ts的配置文件，以下是官网推荐的tsconfig.json配置

## 代码示例

```ts
// tsconfig.json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "esnext",
    // 这样就可以对 `this` 上的数据属性进行更严格的推断
    "strict": true,
    "jsx": "preserve",
    "moduleResolution": "node"
  },
  exclude:['node_modules','dist']
}
```

## 创建项目

### Vite

**如果是使用vite创建的项目，由于vite本来就是用ts写的，所以你直接就可以使用ts了**，你只需要

```vue
<script lang="ts">
  ...
</script>
```

### vue-cli

如果你使用的是vue-cli创建项目，

```vue
# 1. Install Vue CLI, 如果尚未安装
npm install --global @vue/cli@next

# 2. 创建一个新项目, 选择 "Manually select features" 选项
vue create my-project-name

# 3. 如果已经有一个不存在TypeScript的 Vue CLI项目，请添加适当的 Vue CLI插件：
vue add typescript
```

组件使用TS，还要使用`defineComponent`来包裹组件以便获取更好的TS提示

```vue
<template>
  <div>这是详情页</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped></style>
```

### webpack

如果你使用自定义 Webpack 配置，需要配置 `' ts-loader '` 来解析 vue 文件里的 `<script lang="ts">` 代码:

```js
// webpack.config.js
module.exports = {
  ...
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
        exclude: /node_modules/,
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      }
      ...
      ]
  }
}
```

## 组件相关

```vue
1. 要使用lang="ts"注明
2. 定义的组件要使用 defineComponent包裹
3. Vue 对定义了 type 的 prop 执行运行时验证。要将这些类型提供给 TypeScript，我们需要使用 PropType 指明构造函数
<script lang="ts">
  import { defineComponent,PropType } from 'vue'
  export default defineComponent({
      // 已启用类型推断
  })
</script>
```

### 规范数据

下面就是使用接口规范响应式数据

```vue
<template>
  <p>
    {{ author }}在{{ year }}写了{{ title }}，迄今为止全球销量达{{ publish }}册！
  </p>
</template>

<script lang="ts">
import { reactive, toRefs, defineComponent } from "vue";
// 定义一个接口Book
interface Book {
  title: string;
  author: string;
  year: string;
  publish?: number;
}

export default defineComponent({
  setup() {
    // bookInfo符合接口Book
    const bookInfo: Book = reactive({
      title: "《堂吉诃德》",
      author: "塞万提斯",
      year: "1605年",
      publish: 400000000,
    });
    return {
      ...toRefs(bookInfo),
    };
  },
});
</script>

<style lang="scss" scoped></style>

```

### 注解Props

Vue 对定义了 `type` 的 `prop` 执行运行时验证。要将这些类型提供给 TypeScript，我们需要使用 `PropType` 指明构造函数：

```ts
import { defineComponent, PropType } from 'vue'

interface Book {
  title: string
  author: string
  year: number
}

const Component = defineComponent({
  props: {
    name: String,
    success: { type: String },
    // callback这个prop定义了type，所以要用到PropType
    callback: {
      type: Function as PropType<() => void>
    },
    // 同上
    book: {
      type: Object as PropType<Book>,
      required: true
    }
  }
})
```

> 但是由于 TypeScript 中的[设计限制](https://github.com/microsoft/TypeScript/issues/38845)，当它涉及到为了对函数表达式进行类型推理，你必须注意对象和数组的 validator 和 default 值：

```ts
import { defineComponent, PropType } from 'vue'
// 接口
interface Book {
  title: string
  year?: number
}

const Component = defineComponent({
  props: {
    bookA: {
      type: Object as PropType<Book>,
      // 请务必使用箭头函数
      default: () => ({
        title: 'Arrow Function Expression'
      }),
      validator: (book: Book) => !!book.title
    },
    bookB: {
      type: Object as PropType<Book>,
      // 或者提供一个明确的 this 参数
      default(this: void) {
        return {
          title: 'Function Expression'
        }
      },
      validator(this: void, book: Book) {
        return !!book.title
      }
    }
  }
})
```

### 注解ref

```ts
export default defineComponent({
  setup() {
    // ref数据要么是数字要么是字符串
    const year = ref<string | number>(2019);
    const year = ref(2019); //用的是类型推断

    return {
      year,
    };
  },
});
```

### 注解reactive

我们一般使用接口

```ts
import { reactive, toRefs, defineComponent, ref } from "vue";
// 定义一个接口Book
interface Book {
  title: string;
  author: string;
  year: string;
  publish?: number;
}

export default defineComponent({
  setup() {
    // 符合Book规范
    const bookInfo = reactive<Book>({
      title: "《堂吉诃德》",
      author: "塞万提斯",
      year: "1605年",
      publish: 400000000,
    });
    return {
      ...toRefs(bookInfo),
    };
  },
});
```

### 类型声明 computed

不需要我们刻意声明类型了，可以根据返回值自动推断类型。

```ts
import { defineComponent, ref, computed } from 'vue'

export default defineComponent({
  name: 'CounterButton',
  setup() {
    let count = ref(0)

    // 只读
    const doubleCount = computed(() => count.value * 2)

    const result = doubleCount.value.split('') // => Property 'split' does not exist on type 'number'
  }
})
```
