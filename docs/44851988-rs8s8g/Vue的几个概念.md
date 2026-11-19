---
description: "Vue的几个概念一、Vue.extendVue.extend 属于 Vue 的全局 API，在实际业务开发中我们很少使用，因为相比常用的 Vue.component 写法使用 extend 步骤要更加繁琐一些。但是在一些独立组件开发场景中，Vue.extend + $mount 这对组合是我们..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/gz8ake"
updated: "2020-07-20T12:38:39.000Z"
---

# Vue的几个概念

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/gz8ake)

<details class="toc-details">
<summary>本页结构（8 个小节）</summary>

- 一、Vue.extend
- 二、ref
- 代码示例
- 三、watch
- 四、nextTick
- 五、slot
- 5.1 具名插槽
- 5.2 作用域插槽

</details>

## 一、Vue.extend

  

`Vue.extend` 属于 Vue 的全局 API，在实际业务开发中我们很少使用，因为相比常用的 `Vue.component` 写法使用 `extend` 步骤要更加繁琐一些。但是在一些独立组件开发场景中，`Vue.extend` + `$mount` 这对组合是我们需要去关注的。

  

参考文章：[Vue 基础知识之 Vue.extend](https://www.cnblogs.com/hentai-miao/p/10271652.html)

  

## 二、ref

  

> ref 被用来给元素或子组件注册引用信息。引用信息将会注册在父组件的 $refs 对象上。如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例：

  

**一般常用于获取子组件实例（或者DOM）**，通过给子组件设置ref属性，来标识该组件，然后在父组件中就可以通过`this.$refs.ref属性值`获取某个子组件实例：

  

## 代码示例

```html
<!-- `vm.$refs.p` will be the DOM node -->
<p ref="p">hello</p>

<!-- `vm.$refs.child` will be the child component instance -->
<child-component ref="child"></child-component>
```

  

当 `v-for` 用于元素或组件的时候，引用信息将是包含 DOM 节点或组件实例的数组。

  

关于 ref 注册时间的重要说明：因为 ref 本身是作为渲染结果被创建的，在初始渲染的时候你不能访问它们 - 它们还不存在！`$refs` 也不是响应式的，因此你不应该试图用它在模板中做数据绑定。

  

## 三、watch

  

watch常用于监控某个数据的变化，当数据变化的时候就会触发对应的函数（经常用）

  

```js
export default {
  data: {
    question: '',
    answer: 'I cannot give you an answer until you ask a question!'
  },
  watch: {
    // 如果 `question` 发生改变，这个函数就会运行
    question: function (newQuestion, oldQuestion) {
      this.answer = 'Waiting for you to stop typing...'
      this.debouncedGetAnswer()
    }
  },
}
```

  

如果数据是一个对象呢？

  

```js
// 像这样
export default {
    data(){
        return {
            queryData: {
                 name: '',
                 creator: '',
                 selectedStatus: '',
                 time: [],
             }
        }
    }
}
```

  

方法一，使用`deep:true`属性,这样的话`queryData`中的任何属性发生变化都会触发`handler`，显然开销比较大

  

```js
 watch:{
    	queryData: {
         handler: function(newval,oldval) {
            //do something
         },
         deep: true //关键
     }
	}
```

  

但我们更普遍的是，监控对象中的某个属性：

  

```js
watch:{
    'queryData.name':function(newval,oldval){
       console.log(val);
  }
}
```

  

## 四、nextTick

  

**vm.$nextTick(callback)**

  

将回调(`callback`)延迟到下次 `DOM` 更新循环之后执行，在修改数据之后立即使用它，然后等待 `DOM` 更新,更新完成后开始执行`callback`，例如：

  

```html
<div class="app">
  <div ref="msgDiv">{{msg}}</div>
  <div v-if="msg1">Message got outside $nextTick: {{msg1}}</div>
  <div v-if="msg2">Message got inside $nextTick: {{msg2}}</div>
  <div v-if="msg3">Message got outside $nextTick: {{msg3}}</div>
  <button @click="changeMsg">
    Change the Message
  </button>
</div>
```

  

刚开始的渲染情况

  

![图片](/images/e163e9aad7f05c68.png)

  

```js
new Vue({
  el: '.app',
  data: {
    msg: 'Hello Vue.',
    msg1: '',
    msg2: '',
    msg3: ''
  },
  methods: {
    changeMsg() {
      this.msg = "Hello world."
      this.msg1 = this.$refs.msgDiv.innerHTML
      this.$nextTick(() => {
        this.msg2 = this.$refs.msgDiv.innerHTML
      })
      this.msg3 = this.$refs.msgDiv.innerHTML
    }
  }
})
```

  

点击过后

  

![图片](/images/3d3bf5ed8f24b14f.png)

  

你会发现`msg1`和`msg3`都还是`Hello Vue`，因为当执行完`this.msg = "Hello world."`时，`<div ref="msgDiv">{{msg}}</div>`还未完成更新，所以此时`msg1`和`msg3`数据赋值的还是老的`DOM`的`innerHTML`，因为`msg2`是在`nextTick`中，此时已经完成了更新，所以拿到了最新的数据。

  

> 为什么说“下次”呢，因为并不知道当前的数据的更新是第几次

  

**Vue.nextTick(callback)**

  

功能和`vm.$nextTick`差不多，`Vue`生命周期的`created()`钩子函数进行的`DOM`操作一定要放在`Vue.nextTick()`的回调函数中，原因是在`created()`钩子函数执行的时候`DOM`其实并未进行任何渲染，而此时进行`DOM`操作无异于徒劳，所以此处一定要将`DOM`操作的`js`代码放进`Vue.nextTick()`的回调函数中。与之对应的就是`mounted`钩子函数，因为该钩子函数执行时所有的`DOM`挂载已完成。

  

**总之，`nextTick`的回调函数是在`DOM`完成更新后执行的，在`callback`里你拿到的是最新的`DOM`。**

  

## 五、slot

  

官网上是这样定义的：

  

> Vue 实现了一套内容分发的 API，这套 API 的设计灵感源自 [Web Components 规范草案](https://github.com/w3c/webcomponents/blob/gh-pages/proposals/Slots-Proposal.md)，将 `slot` 元素作为承载分发内容的出口

  

像这样在一个组件的标签里“插”入一些内容，如果你什么不做，插入的内容就会被忽略掉，

  

```html
<template>
  <div id="mainContent">
    <tab-switcher>
      hello，我是插槽内容😂 
    </tab-switcher>
    <router-view></router-view>
  </div>
</template>
```

  

上面渲染的时候会忽略掉组件`<tab-switcher>`中插入的内容，但如果该组件的模板里有`<slot>`,`<slot>`的位置就会被替换成插入的`hello，我是插槽内容😂`

  

```html
<!---tab-switcher组件---->
<template>
  <div id="tabSwitcher">
      <!--插槽，slot组件内部的内容会在<tab-switcher>组件标签见没有内容时出现--->
    <slot>EWEQWEQWE</slot>
    <el-tabs
      v-model="activeName"
      @tab-click="handleClick"
      @tab-remove="removeTab"
      closable
    >
      <el-tab-pane label="用户管理" name="first">用户管理</el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>
```

  

**当然，插入的内容也可以是`html`元素，也可以是其他组件，**例如：

  

插入html元素

  

```html
<tab-switcher>
    <h1>hello，我是插槽内容😂</h1>
</tab-switcher>
```

  

插入组件

  

```vue
// 作为内容混入的组件，hello.vue
<template>
  <div id="mainContent">
    我来自组件hello
  </div>
</template>

<script>
export default {};
</script>
hello.vue
```

  

```vue
<!---content.vue---->
<template>
  <div id="mainContent">
    <tab-switcher>
        <!---插入hello组件---->
      <hello></hello>
    </tab-switcher>
    <router-view></router-view>
  </div>
</template>

<script>
import hello from "./pages/hello";
import tabSwitcher from "pages/tabSwitcher";
export default {
  data() {
    return {
      contentWidth: ""
    };
  },
  components: {
    tabSwitcher,
    hello
  },
  created() {},
  computed: {},
  methods: {}
};
</script>
<!---tab-switcher组件还是一样的---->
```

  

![图片](/images/c05a43f4609ed8c3.png)

### 5.1 具名插槽

  

所谓具名插槽，就是带有名字`name`的插槽，在组件的模板里有多个插槽的时候，能让内容“精准”的渲染到正确的位置。

  

**使用**

  

给`slot`标签设置属性`name`

  

```html
<template>
  <div id="mainContent">
    <slot name="header"></slot>
      <!--不带属性name的是默认插槽，该位置渲染出的内容也是不带v-slot指令的template--->
    <slot></slot>
    <slot name="footer"></slot>
  </div>
</template>

<script>
export default {};
</script>
```

  

在向具名插槽提供内容的时候，我们可以在一个 `<template>`元素上使用 `v-slot` 指令，并以 `v-slot` 的参数的形式提供其名称`name`：

  

```vue
<template>
  <div id="mainContent">
    <hello>
      <template v-slot:header>
        <div>
          我是header
        </div>
      </template>
      <template>
        <div>
          我是其他内容
        </div>
      </template>
      <template v-slot:footer>
        <div>
          我是footer
        </div>
      </template>
    </hello>
  </div>
</template>
```

  

> 注意:
> 
> **`v-slot` 只能添加在 \` 上** (只有[一种例外情况](https://cn.vuejs.org/v2/guide/components-slots.html?#%E7%8B%AC%E5%8D%A0%E9%BB%98%E8%AE%A4%E6%8F%92%E6%A7%BD%E7%9A%84%E7%BC%A9%E5%86%99%E8%AF%AD%E6%B3%95))

  

> **具名插槽`v-slot` 也有缩写，即把参数之前的所有内容 (`v-slot:`) 替换为字符 `#`。例如 `v-slot:header` 可以被重写为 `#header`：**

  

### 5.2 作用域插槽

  

作用域插槽的作用**就是为了让子组件的自己的数据，能够应用在插槽内容上**。

  

还是以上面的组件为例：

  

第一步，给`<slot>`组件使用`v-bind`将数据`person`绑定给一个属性`person1`

  

```vue
<!----hello.vue----->
<template>
  <div id="mainContent">
      <!----person是数据，person1是属性---->
    <slot :person1="person"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      person: {
        firstName: "Alice",
        lastName: "Marry"
      }
    };
  }
};
</script>
```

  

第二步，在`template`标签上给`v-slot`赋值`personHH`（名字随便取），然后就可以访问子组件的数据了，如果是具名插槽，记得给v-slot携带参数`v-slot:具名插槽的name名="personHH"`

  

```vue
<!----content.vue---->
<template>
  <div id="mainContent">
    <hello>
      <template v-slot="personHH">
        <div>{{ personHH.person1.lastName }}</div>
          <!---Marry--->
      </template>
    </hello>
  </div>
</template>
```

  

**简写**

  

当被提供的内容***只有*默认插槽**时，组件的标签(在这里是`<hello>`)才可以被当作插槽的模板来使用。这样我们就可以把 `v-slot` 直接用在组件上，上面的可以写成：

  

```vue
<!----content.vue---->
<template>
  <div id="mainContent">
    <hello v-slot="personHH" >
      <div>{{ personHH.person1.lastName }}</div>
          <!---Marry--->
    </hello>
  </div>
</template>
```

  

> 记得只要出现多个插槽，请始终为*所有的*插槽使用完整的基于 `template` 的语法

  

**解构插槽Prop**

  

其实就是用`ES6`语法把原来的数据对象`personHH`给解构了一下

  

```vue
<!----content.vue---->
<template>
  <div id="mainContent">
    <hello>
      <template v-slot={person1}>
        <div>{{ personHH.person1.lastName }}</div>
          <!---Marry--->
      </template>
    </hello>
  </div>
</template>
```
