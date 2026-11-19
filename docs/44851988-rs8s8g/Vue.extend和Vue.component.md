---
description: "Vue.extend和Vue.component一、Vue.componentVue.component通常用来全局创建一个组件，其语法如下：Vue.component(id,options)注意：上述的参数id是一个字符串，将来会作为自定义组件的标签名来使用，options是一个对象，里面包..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/mn3irz"
updated: "2023-07-11T07:20:23.000Z"
---

# Vue.extend和Vue.component

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/mn3irz)

<details class="toc-details">
<summary>本页结构（4 个小节）</summary>

- 一、Vue.component
- 代码示例
- 二、Vue.extend
- 参考文章

</details>

## 一、Vue.component

  

Vue.component通常用来全局创建一个组件，其语法如下：

  

## 代码示例

```js
Vue.component(id,options)
```

  

注意：上述的参数`id`是一个字符串，将来会作为自定义组件的标签名来使用，`options`是一个对象，里面包含例如 `data`、`computed`、`watch`、`methods` 以及生命周期钩子等。仅有的例外是像 `el` 这样根实例特有的选项。

  

然后就可以在任何一个地方使用该组件了，官网的例子：

  

```js
// 定义一个名为 button-counter 的新组件
Vue.component('button-counter', {
  data: function () {
    return {
      count: 0
    }
  },
  template: '<button v-on:click="count++">You clicked me {{ count }} times.</button>'
})
```

  

```vue
 <button-counter></button-counter>
<!----会渲染出一个按钮---->
```

  

## 二、Vue.extend

  

官方的说法：

  

**用法：**`Vue.extend(options)`

  

使用基础 Vue 构造器，创建一个“子类”。参数`option`是一个包含组件选项的对象。`**data**` **选项是特例，需要注意 - 在** `**Vue.extend()**` **中它必须是函数**(因为将来可能会有多个这样的实例出现，如果是一个引用类型的对象，就会发生数据共享)

  

**使用场景**：平常我们不经常用这个东西，但是如果我们要封装一个可复用的组建的时候就要用到了，比如[Vue.extend 编程式插入组件](https://juejin.im/post/5dd0a028e51d4507fc7252f6)。

  

在封装通用的自定义组件的时候，有几个注意的事项：

  

1.  `Vue.extend`获得是一个构造函数，可以通过`new`实例化生成一个 Vue 组件实例，实例化时可以向这个实例传入参数，但是`需要注意`的是 `props` 的值需要通过 `propsData`属性来传递

2.  `options`选项一般是一个我们已经写好的组件

3.  将实例进行挂载`vm.$mount()`以便

> 挂载的时候不能挂在到`#app`上，挂载的过程是将`目标元素的内容全部替换`，所以一旦挂载到 `#app` 上，该元素的所有子元素都会消失被替换

  

例如实现一个弹窗组件：

  

```js
// create.js
import Vue from "vue";
export function create(component, props) {
  const Compo = Vue.extend(component); // 一个组件的构造函数，

  const vm = new Compo({ propsData: props }); // 实例化一个组件，并将props数据传递过去，这里的vm就是一个组件实，你懂的
  console.log(vm);// 组件本身
  vm.$mount(); // 一定要挂载，记得挂载的时候不能挂载到#app上
  //   通过$el属性拿到真实的DOM,并将其插入到body底部
  document.body.appendChild(vm.$el);

  //给该组件添加一个方法
  vm.remove = () => {
    document.body.removeChild(vm.$el);
    vm.$destroy();// 当然要销毁，不然可能会导致内存泄漏
  };
  return vm;
}
```

  

```js

// main.js
import { create } from "./utils/create.js";

Vue.config.productionTip = false;
Vue.prototype.$create = create; // 注册一个全局的方法$create
```

  

调用

  

```js
import Notice from "./components/Notice";// 真正的组件代码

...

 this.$create(Notice, {
    title: "校验失败",
    message: "请重新校验",
    duration: 5000
}).show();
```

## 参考文章

::: tip
https://juejin.cn/post/6890072682864476168
:::

 

::: tip
https://juejin.cn/post/7239715295484821565
:::
