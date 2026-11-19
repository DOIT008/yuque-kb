---
description: "一、什么是vitest？Vitest 是一个由 Vite 提供支持的极速单元测试框架。有如下特点：可继续vite配置支持Vue、React、Lit 等框架测试用例支持HMR，运行速度快 （jest需要通过快捷键P，过滤后来运行指定测试文件）开箱即用 Typescript/JSX/ESM（这一点..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ucc14m5yihbn3frs"
updated: "2024-05-08T21:35:46.000Z"
---

# 单元测试vitest+vue3+ts🧪🧪

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ucc14m5yihbn3frs)

<details class="toc-details">
<summary>本页结构（14 个小节）</summary>

- 一、什么是vitest？
- 二、启动
- 三、配置
- 四、vitest.config.ts/js
- 1、environment
- 2、alias（路径别名）
- 3、globals
- 四、vitest语法规则
- 1、vitest 支持三种方式写测试代码
- 2、测试代码结构

</details>

## 一、什么是vitest？

Vitest 是一个由 Vite 提供支持的**极速单元测试框架**。有如下特点：

-   **可继续vite配置**
-   **支持Vue、React、Lit 等框架**
-   测试用例支持HMR，运行速度快 （jest需要通过快捷键P，过滤后来运行指定测试文件）
-   **开箱即用 Typescript/JSX/ESM**（这一点我想配过 jest 的人应该懂是什么意思）【jest默认不支持ESModule】
-   多线程支持（[tinypool](https://link.zhihu.com/?target=https%3A//github.com/Aslemammad/tinypool)）
-   **与 Jest 几乎相同的 API**，同时也有 Jest 的快照功能（这个非常好用！）
-   通过 [c8](https://link.zhihu.com/?target=https%3A//github.com/bcoe/c8) 输出测试用例覆盖
-   **配置简单**【jest配置太麻烦！！】
-   日志信息很清爽

## 二、启动

```powershell
# 初始化项目
npm create vite@latest

# 集成vitest
# 使用 npm
$ npm install -D vitest

# 使用 yarn
$ yarn add -D vitest

# 使用 pnpm
$ pnpm add -D vitest

```

## 三、配置

运行，package.json添加：

```json
"scripts": {
    "test": "vitest",
    "coverage": "vitest run --coverage" // 覆盖率测试
},
```

上述的命令是测试所有文件的，但如果要单独测试某个文件：

```ts
// npm run test reactive,实际运行的是reactive.spec.ts
npm run test <文件名>
// 或者
yarn test <文件名>

```

覆盖率测试要安装`@vitest/coverage-c8`：

```powershell
npm install -D @vitest/coverage-c8
```

## 四、vitest.config.ts/js

vitest提供了很多配置项，下面列举一下常用的几个配置：

### 1、environment

Vitest 中的默认测试环境是一个 Node.js 环境。如果你正在构建 Web 端应用程序，你可以使用 `jsdom` 或 `happy-dom` 这种类似浏览器(browser-like)的环境来替代 Node.js

```powershell
npm install -D jsdom
```

并在`vitest.config.ts`配置`environment`：

```ts
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    environment:'jsdom' 
  },
});
```

### 2、alias（路径别名）

目录

![image.png](/images/e8e677fa6d76660a.png)

安装依赖

```powershell
# 安装path
npm install --save-dev @types/node 
```

在`vitest.config.ts`中配置`alias`

```ts
import { defineConfig } from "vitest/config";
import { resolve } from "path";
export default defineConfig({
  test: {
    // globals,environment等
  },
  // 设置别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});

```

如上图所示，因为`tests`文件夹和`src`文件夹是同一级，所以还要在`tsconfig.json`配置属性`include`

![image.png](/images/9053f30ada75d2ba.png)

> 当然如果tests文件夹在src内部就可以省略了，因为已经符合src/\*\*/\*.ts啦

vitest路径别名`tsconfig.json`**关键**配置：

```ts
{
  compilerOptions:{
    "baseUrl": "",                                 
    "paths": {
      "@/*": ["src/*"],
    },     
  },
  "include": ["src/**/*.ts","tests/**/*.ts"]
}
```

### 3、globals

vitest 不显式提供全局 API。如果你更倾向于使用类似 jest 中的全局 API，配置中添加 `globals: true`

```ts
import { defineConfig } from "vitest/config";
export default defineConfig({
  test: {
    globals:true 
  },
});
```

为了可以让全局 API 支持 Typescript，请将 `vitest/globals` 添加到 `tsconfig.json` 中的 `types` 选项中：

```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

## 四、vitest语法规则

### 1、vitest 支持三种方式写测试代码

1.  以 `.spec.js/ts` 命名
2.  以 `.test.js/ts` 命名
3.  放在 `__tests__`文件夹下

### 2、测试代码结构

为了编写测试，我们需要利用以下常见的方法，这些方法可以从 Vitest 导入。

-   **describe**：这个函数接受一个名字和一个函数，用于将相关的测试组合在一起。当你为一个有多个测试点（如逻辑和外观）的组件编写测试时，它就会很方便。
-   **test/it**：这个函数代表被测试的实际代码块。它接受一个字符串，通常是测试案例的名称或描述（例如，渲染成功的正确样式）和另一个函数，所有的检查和测试在这里进行。
-   **expect**： 这个函数用于测试值或创建断言。它接受一个预期为实际值（字符串、数字、对象等）的参数x，并使用任何支持的方法对其进行评估（例如toEqual(y)，检查 x 是否与 y 相同）。

## 五、小试牛刀

### 1、测试js/ts文件

```ts
export function add(a:number,b:number){
  return a+b;
}

export function addPlus(a:number,b:number,c:number){
  return a+b+c;
}

```

 

```ts
import {expect,test,describe} from 'vitest';
import {add,addPlus} from "@/index"; // 原生支持esmodule
describe("测试index.ts", () => {
  test("add", () => {
    const res = add(1,5);
    expect(res).toBe(6);
  })
  test("addPlus", () => {
    const res = addPlus(1,5,10);
    expect(res).toBe(16);
  })
})

```

或者

```ts
export default function double (n: number): number {
  return n*2
}

```

 

```ts
import {test,describe,expect} from 'vitest';
import double from "@/example";
describe("测试example.ts", () => {
  test("测试函数double", () => {
    const res = double(19);
    expect(res).toBe(38)
  })
})
```

### 2、测试vue文件

由于我们是用单独的`vitest.config.ts`配置`vitest`的，其内部的配置优先级是最高的(比`vite.config.ts`要高)，所以需要再次引入`@vitejs/plugin-vue`，不然没办法识别`.vue`文件

```ts
import { defineConfig } from "vitest/config";
import { resolve } from "path";
// 重要
import vue from '@vitejs/plugin-vue'
export default defineConfig({
  test: {
    // vitest 不显式提供全局 API。如果你更倾向于使用类似 jest 中的全局 API，可以将 --globals 选项传递给 CLI 或在配置中添加 globals: true
    globals:true,
    // Vitest 中的默认测试环境是一个 Node.js 环境。如果你正在构建 Web 端应用程序，你可以使用 jsdom 或 happy-dom 这种类似浏览器(browser-like)的环境来替代 Node.js
    environment:'jsdom' 
  },
  // 设置别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins:[
    vue()
  ]
});
```

#### 举个栗子

```vue
<template>
  <div>
    <h1>{{ msg }}</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref } from 'vue'

export default defineComponent({
  setup () {
    const msg = ref('哈喽~')
    return {
      msg
    }
  }
})
</script>

<style scoped>

</style>
```

对应测试文件

```ts
import {it,describe,expect} from 'vitest';
import greeting from '@/components/greeting.vue';
import {mount} from "@vue/test-utils";
describe("测试greeting.vue文件", () => {
  it("测试 msg", () => {
    const wrapper = mount(greeting);
    expect(wrapper.text()).toMatch('哈喽~')
  })
})
```

#### 条件渲染

```vue
<template>
  <div>
    <h1 id="hindex" >{{ msg }}</h1>
    <h1 v-if="isAdmin" id="admin" >我是一个管理员</h1>
    <h1 v-show="isShow" id="showh" >我被显示出来了</h1>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref,reactive,toRefs } from 'vue'

export default defineComponent({
  setup () {
    const msg = ref('哈喽~');
    const reactiveData = reactive({
      isShow:false,
      isAdmin:false
    })
    return {
      msg,
      ...toRefs(reactiveData)
    }
  }
})
</script>

<style scoped>

</style>
```

对应的测试文件

```ts
import {it,describe,expect} from 'vitest';
import foo from '@/components/foo.vue';
import {mount} from "@vue/test-utils";
describe("foo.vue文件", () => {
  it("测试 msg", () => {
    const wrapper = mount(foo);
    // 一个domWrapper
    const profile = wrapper.get('#hindex');
    expect(profile.text()).toBe('哈喽~')
  })

  it("看元素是否存在", () => {
    const wrapper = mount(foo);
    // 一个domWrapper，寻找#isAdmin
    const profile = wrapper.find('#isAdmin');
    // 看其是否存在
    expect(profile.exists()).toBe(false)
  })

  it("看元素是否显示，isShow", () => {
    const wrapper = mount(foo);
    // 一个domWrapper，寻找#isShow元素
    const profile = wrapper.find('#showh');
    // 看其是否显示
    expect(profile.isVisible()).toBe(false)
  })
})
```

#### 测试emit

```vue
<template>
  <div>
    <button @click="clickFn" id="btNo" >测试自定义事件</button>
    <button @click="clickYes" id="btYes" >测试自定义事件</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  // 定义自定义事件
  emits:['fng','btt'],
  setup (props,{emit}) {
    const clickFn = ()=>{
      emit('fng')
    }
    const clickYes = ()=>{
      emit('btt',12)
    }
    return {
      clickFn,
      clickYes
    }
  }
})
</script>

<style scoped>

</style>
```

对应测试文件

```ts
import {it,describe,expect} from 'vitest';
import bar from '@/components/bar.vue';
import {mount} from "@vue/test-utils";
describe("测试bar.vue文件", () => {
  it("测试 自定义事件 fng", () => {
    const wrapper = mount(bar);
    // 拿到button元素,模拟点击事件
    const profile = wrapper.get("#btNo").trigger('click');
    console.log(wrapper.emitted());
    // expect(wrapper.emitted()).toHaveProperty('fng')
    expect(wrapper.emitted('fng')).toBeTruthy()
  })

  it("测试 带参数的自定义事件 btt ", () => {
    const wrapper = mount(bar);
    // 拿到button元素,模拟点击事件
    const profile = wrapper.get("#btYes").trigger('click');
    console.log(wrapper.emitted('btt'));
    expect(wrapper.emitted('btt')?.[0]).toEqual([12])
  })
})
```

#### 测试props

```vue
<template>
  <div>
    <input v-model="pass" type="text">
    <p v-if="message" data-msg="pass" >{{ message }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue'
export default defineComponent({
  props: ['minLength'],
  setup(props) {
    const pass = ref<string>('');
    const message = computed(() => {
      if (pass.value.length < props.minLength) {
        return `密码至少${props.minLength}位`
      } else {
        return ''
      }
    })
    return {
      pass,
      message
    }
  }
})
</script>

<style scoped>

</style>
```

 

```ts
import {expect,test,describe,it} from 'vitest';
import password from "@/components/password.vue";
import { mount } from '@vue/test-utils';
describe("password", () => {
  it("校验props",async () => {
    // 挂载，并设置props
    const wrapper = mount(password,{
      props:{
        minLength: 10,
      }
    });
    // 设置输入框的值,因为setValue是异步的
   await wrapper.get('input').setValue('hahdhada');

    //方式1. 判断p标签是否存在
    expect(wrapper.find("[data-msg='pass']").exists()).toBe(true)
    //方式2. 判断p标签的内容是否符合
    expect(wrapper.find("[data-msg='pass']").text()).toContain('密码至少10位')
  })
})

```

#### 测试插槽

```vue
<template>
  <div>
    <!-- 默认插槽 -->
    <div id="default">
      <slot></slot>
    </div>
    <!-- 具名插槽Haha -->
    <div id="nameSlot">
      <slot name="Haha" ></slot>
    </div>
    <!-- 作用域插槽 -->
    <div id="scopeSlot">
      <slot name="scopeSlot" :msg="message" ></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent,ref } from 'vue'

export default defineComponent({
  setup () {
    const message = ref<string>('哈喽呀~~')
    return {
      message
    }
  }
})
</script>

<style scoped>

</style>
```

 

```ts
import {expect,test,describe,it} from 'vitest';
import layout from "@/components/layout.vue";
import bar from "@/components/bar.vue";
import { mount } from '@vue/test-utils';
describe("layout", () => {
  // 测试默认插槽
  it("默认插槽--单个", () => {
    const wrapper = mount(layout,{
      slots:{
        default:'嘻嘻'
      }
    })
    expect(wrapper.find("#default").text()).toContain('嘻嘻')
  })
  
  it("默认插槽-多个", () => {
    const wrapper = mount(layout,{
      slots:{
        default:['<div id="yaya">这是什么鬼</div>','<div id="woca">花儿为啥这样红</div>']
      }
    })
    expect(wrapper.find("#yaya").text()).toContain('这是什么鬼');
    expect(wrapper.find("#woca").text()).toContain('花儿为啥这样红');
  })

  // 测试具名插槽
  it("具名插槽--Haha", () => {
    const wrapper = mount(layout,{
      slots:{
        Haha:'<div>我滴娘呀！</div>'
      }
    })
    expect(wrapper.find("#nameSlot").text()).toContain('我滴娘呀！')
  })

  // 作用域插槽
  it("作用域插槽", () => {
    const wrapper = mount(layout,{
      slots:{
        scopeSlot:`
        <template #scopeSlot = 'data' >
          你好呀 {{data.msg}}
        </template>`
      }
    });
    console.log(wrapper.find("#scopeSlot").html());
    expect(wrapper.find("#scopeSlot").text()).toContain('你好呀 哈喽呀~~')
  })

  // 高级用法
  it("默认插槽-高级用法", () => {
    const wrapper = mount(layout,{
      slots:{
        // 传入组件
        default:bar
        // default:'<div>dadadada</div>'
        // default:{
        //   template:'<div>aaaaaa</div>'
        // }
      }
    });
    expect(wrapper.get('#btNo').text()).toContain('测试自定义事件')
  })
})

```

#### 测试tsx/jsx

由于是`.tsx`或者`.jsx`文件，vitest默认不支持这种类型的文件解析，所以需要安装一个插件：

```powershell
npm i -D @vitejs/plugin-vue-jsx
```

并在`vitest.config.ts`文件中进行配置插件`vueJsx()`，**也是一个比较完整的配置文件**

```ts
import { defineConfig } from "vitest/config";
import { resolve } from "path";
import vue from '@vitejs/plugin-vue'
// 引入插件：@vitejs/plugin-vue-jsx
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  test: {
    globals:true,
    environment:'jsdom',
    transformMode:{
      // 表示当遇到.t/jsx文件时，环境是web环境
      'web':[/.[tj]sx$/]
    }
  },
  // 设置别名
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  plugins:[
    // 使用
    vueJsx(),
    vue()
  ]
});

```

开始测试吧

```tsx
import {defineComponent} from "vue";
export default defineComponent({
  setup(){
    return () =>  (<h1>纯粹是为了测试tsx</h1>);
  }
})
```

 

```ts
import { mount } from '@vue/test-utils';
import { describe,it,expect } from "vitest";
import hei from '@/components/hei';

describe("测试tsx组件", () => {
  it("hei", () => {
    const wrapper = mount(hei);
    expect(wrapper.find("h1").text()).toContain('纯粹是为了测试tsx')
  })
})
```

不过前端组件测试更好的测试工具是[cypress](https://www.cypress.io/)，这个以后再说吧！

## 六、参考

1.  [Vitest官网](https://cn.vitest.dev/)
2.  [Vitest 的初体验 | 前端新一代的测试框架 | 快快快](https://www.bilibili.com/video/BV1mg41167VX/?spm_id_from=333.788&vd_source=6f546a5e3d16c5b0678838b5f4de742a)
3.  [试试使用 Vitest 进行组件测试，确实很香。](https://juejin.cn/post/7129667747134308389#heading-12)​
