---
description: "这里主要总结一下ElementUI3.x和ElementUI2.x不一样的地方，下面概述的都是ElementUI3.x的用法.一、安装Element3.x# NPM $ npm install element-plus --save  # Yarn $ yarn add element-plu..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pag4le"
updated: "2024-04-08T01:34:56.000Z"
---

# Vue+Element Plus

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pag4le)

<details class="toc-details">
<summary>本页结构（4 个小节）</summary>

- 一、安装Element3.x
- 代码示例
- 二、图标
- 三、修改组件内部样式

</details>

这里主要总结一下`ElementUI3.x`和`ElementUI2.x`不一样的地方，下面概述的都是`ElementUI3.x`的用法.

## 一、安装Element3.x

## 代码示例

```powershell
# NPM
$ npm install element-plus --save

# Yarn
$ yarn add element-plus

# pnpm
$ pnpm install element-plus
```

引用并全局注册

```powershell
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
```

> 之后就可以在全局使用内置组件了（图标除外）

如果您使用 Volar，请在 `tsconfig.json` 中通过 `compilerOptions.type` 指定全局组件类型。

```ts

{
  "compilerOptions": {
    // ...
    "types": ["element-plus/global"]
  }
}
```

## 二、图标

在安装ElementUI3.x的时候，并没有安装图标，需要我们自己单独安装相关的依赖

```powershell
# NPM
$ npm install @element-plus/icons-vue
# Yarn
$ yarn add @element-plus/icons-vue
# pnpm
$ pnpm install @element-plus/icons-vue
```

注册，然后全局注册组件，你要使用的哪个图标就在`main.ts`中引用并注册哪个图标的组件：

```ts
import { createApp } from "vue";
// 引用Search图标
import { Search } from "@element-plus/icons-vue";
const app = createApp(App);// 创建根实例
// 全局注册
app.component("Search", Search);

```

或者安装所有的图标通过循环

```js
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
```

使用

```vue
// el-icon只有两个属性，color和size
<el-icon class="search">
  <Search />
</el-icon>
```

更多可参考[官网](https://element-plus.gitee.io/zh-CN/component/icon.html#%E5%9B%BE%E6%A0%87%E9%9B%86%E5%90%88)。

## 三、修改组件内部样式

可使用`::v-deep`深度选择器别名，例如修改表格合计行样式：

```html
<!-- scss使用::v-deep而不是/deep/，不然会报错 -->
<style lang="scss" >
  ::v-deep.el-table .el-table__footer-wrapper .cell {
    font-weight: 600;
    }
</style>

<!-- less使用/deep/ -->
<style lang="scss" >
  /deep/ .el-table .el-table__footer-wrapper .cell {
    font-weight: 600;
    }
</style>
```

更多可参考[这篇文章](https://www.cnblogs.com/zhangyuanmingboke/p/16962861.html)
