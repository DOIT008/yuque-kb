---
description: "generic=\"T\"generic=\"T\" 是 Vue 3.3+ 版本中引入的一个新特性，用于在组件中声明泛型参数。它允许你创建可重用的组件，同时保持 TypeScript 的类型安全。泛型组件的基本概念泛型组件允许你定义一个可以接受多种类型的组件，而不是固定为特定类型。在 VirtualL..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/gmhrtp69ockmwt47"
updated: "2025-09-04T09:40:40.000Z"
---

# Vue3.3✨

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/gmhrtp69ockmwt47)

<details class="toc-details">
<summary>本页结构（9 个小节）</summary>

- generic="T"
- 泛型组件的基本概念
- 泛型组件的作用
- 在 VirtualList 组件中的使用
- 在父组件中的使用
- 多个泛型参数
- 泛型约束
- 完整代码
- 总结

</details>

## generic="T"

`generic="T"` 是 Vue 3.3+ 版本中引入的一个新特性，**用于在组件中声明泛型参数。它允许你创建可重用的组件**，同时保持 TypeScript 的类型安全。

### 泛型组件的基本概念

泛型组件允许你定义一个可以接受多种类型的组件，而不是固定为特定类型。在 VirtualList.vue 中，`generic="T"` 声明了一个名为 `T` 的泛型参数，这个参数可以在整个组件中使用。

### 泛型组件的作用

1.  **类型灵活性**：使组件能够适应不同类型的数据，而不需要为每种类型创建单独的组件。
2.  **类型安全**：保持 TypeScript 的类型检查和代码提示功能。
3.  **代码重用**：减少重复代码，提高开发效率。

### 在 VirtualList 组件中的使用

在 `VirtualList.vue` 中，`generic="T"` 的使用方式如下：

```ts
<script setup lang="ts" generic="T">
  import { ref, onMounted, computed, nextTick, withDefaults } from 'vue';

interface Props {
  // 巨量源数据 - 使用泛型 T
  data: T[]
  // 预估高度，用于不定高模式（定高模式下也作为元素高度）
  estimatedHeight?: number | string
  // 是否启用不定高模式
  useDynamicHeight?: boolean
  // 盒子高度
  boxHeight?: number | string,
  bufferSize?: number
}

interface Slots {
  // 在 slot 中也使用泛型 T
  default: (props: { item: T; index: number }) => any
}

const props = withDefaults(defineProps<Props>(),{
  data: () => [],
  estimatedHeight:50,
  useDynamicHeight:true,
  boxHeight:0,
  bufferSize:5
})

const slots = defineSlots<Slots>()
  </script>

```

### 在父组件中的使用

当在父组件中使用 `VirtualList` 时，TypeScript 会根据传入的 `data` 数组自动推断出 `T` 的类型：

```vue
<template>
  <div>
    <VirtualList :data="list" :estimatedHeight="50" :useDynamicHeight="true" :boxHeight="500" :bufferSize="5">
      <template v-slot="{ item }:{item:ListItem}">
        <!-- 这里的 item 会被自动推断为 ListItem 类型 -->
        <div class="">姓名：{{ item.name }}</div>
        <div class="">年龄：{{ item.age }}</div>
        <div class="">ID：{{ item.id }}</div>
      </template>
    </VirtualList>
  </div>
</template>
<script setup lang="ts">
  import { ref, onMounted } from 'vue';

  interface ListItem {
    id: number
    name: string
    age: number
  }

  const list = ref<ListItem[]>([])

    // ... 初始化数据
    </script>

```

### 多个泛型参数

如果需要，你还可以声明多个泛型参数：

```ts
<script setup lang="ts" generic="T, U">
interface Props {
  data: T[]
  config: U
}

const props = defineProps<Props>()
</script>

```

### 泛型约束

你还可以为泛型添加约束，限制它可以接受的类型：

```ts
<script setup lang="ts" generic="T extends { id: number | string }">
interface Props {
  data: T[]
}

const props = defineProps<Props>()
</script>

```

这样，`T` 必须是一个包含 `id` 属性的对象类型。

### 完整代码

```ts
<!--
 * @Date: 2025-03-04 09:00:14
 * @LastEditors: DOIT 109971423+DOIT008@users.noreply.github.com
 * @LastEditTime: 2025-09-04 15:37:14
 * @Author: DOIT 109971423+DOIT008@users.noreply.github.com
 * @Description: 支持定高/不定高的虚拟滚动列表
-->
<!--
* 不定高实现方案：预估高度+实际测量+动态调整
* 1. 使用estimatedHeight作为初始预估高度
* 2. 实际渲染后测量每个项的offsetHeight并缓存
* 3. 滚动时根据缓存的高度计算可见区域
* 4. 添加前后缓冲区避免快速滚动出现空白
-->

<template>
  <div class="virtual-list" @scroll="handleScroll" :style="{ height: `${props.boxHeight}px` }">
    <!-- 滚动占位容器 - 用于支撑滚动条高度 -->
    <div class="virtual-list-box" :style="{ height: totalHeight + 'px' }"></div>
    <!-- 可视区域内的元素列表 - 使用transform定位 -->
    <div class="visual-box" :style="{ transform: `translateY(${offsetTop}px)` }">
      <div v-for="index in visibleIndices" :key="index" :ref="el => setItemRef(index, el as HTMLElement)" class="virtual-item">
        <slot name="default" :item="props.data[index]" :index="index"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T" >
import { ref, onMounted, computed, defineProps, nextTick,withDefaults,defineSlots } from 'vue';
interface Props {
  // 巨量源数据
  data: T[]
  // 预估高度，用于不定高模式（定高模式下也作为元素高度）
  estimatedHeight?: number | string
  // 是否启用不定高模式
  useDynamicHeight?: boolean
  // 盒子高度
  boxHeight?: number | string,
  bufferSize?: number
}
interface Slots<T=any> {
  default:(props:{item:T;index:number})=>any
}
const slots = defineSlots<Slots>()
const props = withDefaults(defineProps<Props>(),{
  estimatedHeight:50,
  useDynamicHeight:true,
  boxHeight:0,
  bufferSize:5
})
// 状态管理
const startIndex = ref<number>(0) // 可视区域起始索引
const endIndex = ref<number>(1) // 可视区域结束索引
const heightMap = ref<Record<number,number>>({}) // 存储每个项的实际高度 { index: height }
const totalHeight = ref<number>(0) // 列表总高度

// 计算可视项索引数组(从startIndex到endIndex的连续索引数组)
const visibleIndices = computed<number[]>(() => {
  return Array.from({ length: Math.max(0, endIndex.value - startIndex.value) }, (_, i) => startIndex.value + i);
})

/**
 * 计算可视区域的偏移量（距离顶部的距离）
 * @returns {Number} 偏移像素值
 * @description 用于通过transform: translateY()定位可视区域内容
 */
const offsetTop = computed<number>(() => {
  // 定高模式直接计算偏移量
  if (!props.useDynamicHeight) {
    return startIndex.value * Number(props.estimatedHeight);
  }
  // 不定高模式：累加起始索引前所有项的高度
  return props.data.slice(0, startIndex.value).reduce((sum, _, index) => {
    return sum + (heightMap.value[index] || Number(props.estimatedHeight));
  }, 0);
})

/**
 * 更新列表总高度
 * @description 根据缓存的高度数据重新计算整个列表的总高度
 * 用于设置占位容器高度，确保滚动条正常工作
 */
const updateTotalHeight = ():void => {
  totalHeight.value = props.data.reduce((sum, _, index) => {
    return sum + (heightMap.value[index] || Number(props.estimatedHeight));
  }, 0);
}

/**
 * 设置列表项ref并测量实际高度
 * @param {Number} index - 列表项索引
 * @param {HTMLElement} el - DOM元素（通过ref传递）
 * @description 组件渲染后测量实际高度并缓存，高度变化时更新缓存并重新计算
 */
const setItemRef = (index:number, el:HTMLElement):void => {
  if (el) {
    nextTick(() => {
      const height = el.offsetHeight;
      // 高度变化时才更新缓存并重新计算
      if (heightMap.value[index] !== height) {
        heightMap.value[index] = height;
        updateTotalHeight();
        handleScroll(); // 高度变化后重新计算可见区域
      }
    });
  }
}

/**
 * 根据滚动位置查找起始索引
 * @param {Number} scrollTop - 滚动条距离顶部的距离
 * @returns {Number} 可视区域的起始索引
 * @description 通过累加高度找到第一个可见项的索引
 */
const findStartIndex = (scrollTop:number):number => {
  if (scrollTop === 0) return 0;
  let sum = 0;
  for (let i = 0; i < props.data.length; i++) {
    const height = heightMap.value[i] || Number(props.estimatedHeight);
    sum += height;
    if (sum > scrollTop) {
      return i;
    }
  }
  return props.data.length - 1;
}

/**
 * 初始化：组件挂载后执行
 * @description 初始化时计算一次可视区域
 */
onMounted(() => {
  handleScroll()
})

/**
 * 滚动事件处理函数
 * @description 根据滚动位置动态计算可视区域的起始和结束索引
 * 是虚拟滚动的核心逻辑实现
 */
const handleScroll = ():void => {
  // 获取容器元素
  const container = document.getElementsByClassName('virtual-list')[0];
  if (!container) return;

  const containerHeight = container.clientHeight; // 容器可视高度
  const scrollTop = container.scrollTop; // 滚动条位置

  if (props.useDynamicHeight) {
    // ===== 不定高模式处理 =====
    // 1. 查找起始索引
    startIndex.value = findStartIndex(scrollTop);

    // 2. 计算结束索引：累加高度直到超过容器高度
    let accumulatedHeight = 0;
    endIndex.value = startIndex.value;
    while (endIndex.value < props.data.length) {
      const itemHeight = heightMap.value[endIndex.value] || Number(props.estimatedHeight);
      accumulatedHeight += itemHeight;

      // 当累加高度超过容器高度时停止
      if (accumulatedHeight > containerHeight) break;
      endIndex.value++;
    }

    // 3. 添加前后缓冲区（防止快速滚动出现空白）
    startIndex.value = Math.max(0, startIndex.value - props.bufferSize);
    endIndex.value = Math.min(props.data.length, endIndex.value + props.bufferSize);
  } else {
    // ===== 定高模式处理 =====
    const itemHeight = Number(props.estimatedHeight);
    startIndex.value = Math.floor(scrollTop / itemHeight);
    endIndex.value = startIndex.value + Math.ceil(containerHeight / itemHeight);
  }
};
</script>

<style lang="scss" scoped>
.virtual-list {
  width: 100%;
  overflow: auto;
  position: relative;

  .virtual-list-box {
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
  }
}
</style>
```

 

```ts
<template>
  <div>
    <VirtualList :data="list" :estimatedHeight="50" :useDynamicHeight="true" :boxHeight="500" :bufferSize="5">
      <template v-slot="{item}:{item:ListItem}">
        <div class="">姓名：{{ item?.name }}</div>
        <div class="">年龄：{{item?.age}}</div>
        <div class="">ID：{{item?.id}}</div>
      </template>
    </VirtualList>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
interface ListItem {
  id: number
  name: string
  age: number
}
// 数据
const list = ref<ListItem[]>([])
onMounted(() => {
  let _list = []
  for (let i = 0; i < 300; i++) {
    _list.push({
      id: i,
      name: `张三${i}`,
      age: 18
    })
  }
  list.value = _list
});
</script>

<style scoped>

</style>
```

### 总结

`generic="T"` 是 Vue 3.3+ 中引入的泛型组件声明语法，它使组件能够适应不同类型的数据，同时保持 TypeScript 的类型安全。在 VirtualList 组件中，它允许 data 属性接受任意类型的数组，并在 slot 中正确推断出 item 的类型，提供更好的开发体验和类型检查。
