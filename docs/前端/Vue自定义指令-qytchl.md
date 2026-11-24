---
description: "Vue 自定义指令除了核心功能默认内置的指令 (v-model 和 v-show)，Vue 也允许注册自定义指令，但是官网提供的默认指令可能并不会满足一些特殊需要---你仍然需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。一、注册1.1 全局注册为了复用性，自定义指令一般都是要..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qytchl"
updated: "2020-06-13T15:13:11.000Z"
---

# Vue自定义指令

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qytchl)

<details class="toc-details">
<summary>本页结构（5 个小节）</summary>

- Vue 自定义指令
- 一、注册
- 代码示例
- 二、使用
- 三、钩子函数

</details>

## Vue 自定义指令

  

除了核心功能默认内置的指令 (`v-model` 和 `v-show`)，Vue 也允许注册自定义指令，但是官网提供的默认指令可能并不会满足一些特殊需要---你仍然需要对普通 DOM 元素进行底层操作，这时候就会用到自定义指令。

  

### 一、注册

  

#### 1.1 全局注册

  

为了复用性，自定义指令一般都是要全局注册的，注册的时候使用`Vue.directive`:

  

## 代码示例

```js
Vue.directive(指令名称,{
    // bind,inserted...钩子函数
})
```

  

比如:

  

```js
Vue.directive(`focused`, {
  inserted(el) {
    el.focus();
  }
});
```

  

#### 1.2 组件内注册

  

在某个`.vue`组件内使用`directives`选项，以上面的`focused`为例：

  

```js
export.default {
    directives: {
    focused: {
      bind(el) {
        console.log(el);
      },
      inserted(el) {
        el.focus();
      }
    }
  },
}
```

  

### 二、使用

  

在使用指令的时候要在指令名添加前缀`v-`，比如：`v-focused`,`v-slaved`

  

```js
<input type="text" v-focused />
```

  

### 三、钩子函数

  

上面我们说了，在注册自定义指令的时候你真正要做的事情是在钩子里面的，一个指令定义对象可以提供如下几个钩子函数 (均为可选)：

  

-   `bind`：只调用一次，指令第一次绑定到元素时调用。在这里可以进行一次性的初始化设置。

-   `inserted`：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)。

-   `update`：所在组件的 VNode 更新时调用，**但是可能发生在其子 VNode 更新之前**。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新 (详细的钩子函数参数见下)。

  

我们会在[稍后](https://cn.vuejs.org/v2/guide/render-function.html#%E8%99%9A%E6%8B%9F-DOM)讨论[渲染函数](https://cn.vuejs.org/v2/guide/render-function.html)时介绍更多 VNodes 的细节。

  

-   `componentUpdated`：指令所在组件的 VNode **及其子 VNode** 全部更新后调用。

-   `unbind`：只调用一次，指令与元素解绑时调用。

  

接下来我们来看一下钩子函数的参数 (即 `el`、`binding`、`vnode` 和 `oldVnode`)。

  

#### 3.1 钩子函数的参数

  

指令钩子函数会被传入以下参数：

  

-   `el`：指令所绑定的元素，可以用来直接操作 DOM。

-   `binding`  
    ：一个对象，包含以下 property：

-   `name`：指令名，不包括 `v-` 前缀。

-   `value`：指令的绑定值，例如：`v-my-directive="1 + 1"` 中，绑定值为 `2`。

-   `oldValue`：指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。

-   `expression`：字符串形式的指令表达式。例如 `v-my-directive="1 + 1"` 中，表达式为 `"1 + 1"`。

-   `arg`：传给指令的参数，可选。例如 `v-my-directive:foo` 中，参数为 `"foo"`。

-   `modifiers`：一个包含修饰符的对象。例如：`v-my-directive.foo.bar` 中，修饰符对象为 `{ foo: true, bar: true }`。

-   `vnode`：Vue 编译生成的虚拟节点。移步 [VNode API](https://cn.vuejs.org/v2/api/#VNode-%E6%8E%A5%E5%8F%A3) 来了解更多详情。

-   `oldVnode`：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。

  

> 除了 `el` 之外，其它参数都应该是只读的，切勿进行修改。如果需要在钩子之间共享数据，建议通过元素的 [`dataset`](https://developer.mozilla.org/zh-CN/docs/Web/API/HTMLElement/dataset) 来进行。
