---
description: "1. PropType主要用途：用于在组件props定义中指定复杂类型使用场景：当props需要使用接口、联合类型、泛型等复杂类型时示例：import { defineComponent, type PropType } from 'vue' export default defineComp..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qr83m0gz5z9hy1ai"
updated: "2025-09-29T09:40:32.000Z"
---

# Vue中常用的TS工具类型

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qr83m0gz5z9hy1ai)

<details class="toc-details">
<summary>本页结构（6 个小节）</summary>

- 1\. PropType
- 代码示例
- 2\. MaybeRef / MaybeRefOrGetter
- 3\. ExtractPropTypes
- 4\. CSSProperties
- 

</details>

## 1\. PropType

**主要用途**：用于在组件props定义中指定复杂类型

**使用场景**：当props需要使用接口、联合类型、泛型等复杂类型时

**示例**：

## 代码示例

```ts
import { defineComponent, type PropType } from 'vue'

export default defineComponent({
  props: {
    user: {
      type: Object as PropType<{
        id: number
        name: string
      }>,
      required: true
    },
    status: {
      type: String as PropType<'active' | 'inactive' | 'pending'>,
      default: 'pending'
    }
  }
})
```

## 2\. MaybeRef / MaybeRefOrGetter

**主要用途**：表示值可能是ref类型或原始类型

**使用场景**：在组合式函数中处理可选的响应式参数

**示例**：

```ts
import { type MaybeRef, toRef } from 'vue'

function useCounter(value: MaybeRef<number> = 0) {
  const count = toRef(value)
  // ...
}

// MaybeRefOrGetter 还支持函数形式
function useFetch(url: MaybeRefOrGetter<string>) {
  // ...
}
```

## 3\. ExtractPropTypes

**主要用途**：从组件的props选项中提取类型定义

**使用场景**：获取组件props的类型，用于类型检查或创建兼容的对象

**示例**：

```ts
import { defineComponent, ExtractPropTypes } from 'vue'

const props = {
  name: String,
  age: { type: Number, required: true }
}

export default defineComponent({ props })

export type MyComponentProps = ExtractPropTypes<typeof props>
// MyComponentProps 类型为 { name?: string, age: number }
```

## 4\. CSSProperties

`CSSProperties` 本质上是一个接口，它**定义了所有有效的 CSS 属性及其类型**。在 Vue 3 的 TypeScript 环境中，使用这个类型可以为样式对象提供完整的类型检查和智能提示。典型的使用场景：

```ts
import {type CSSProperties} from 'vue';

// 1. 在组件 props 中定义
interface MyComponentProps {
  containerStyle?: CSSProperties;
}

// 2. 在 setup 函数中使用
const useComponent = () => {
  const dynamicStyle = computed<CSSProperties>(() => ({
    color: isActive.value ? 'red' : 'blue',
    fontSize: '16px',
    // 这里会获得完整的 CSS 属性提示和类型检查
  }));
  
  return { dynamicStyle };
};

// 3. 在渲染函数中应用
const render = () => (
  <div style={dynamicStyle.value}>
    内容
  </div>
);
```

  

## 

##
