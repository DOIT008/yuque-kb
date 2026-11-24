---
description: "Vue插件插件通常用来为 Vue 添加全局功能。插件的功能范围没有严格的限制——一般有下面几种：添加全局方法或者属性。如: vue-custom-element添加全局资源：指令/过滤器/过渡等。如 vue-touch通过全局混入来添加一些组件选项。如 vue-router添加 Vue 实例方..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/kqncr6"
updated: "2020-06-13T15:12:46.000Z"
---

# Vue.plugin的插件

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/kqncr6)

<details class="toc-details">
<summary>本页结构（7 个小节）</summary>

- Vue插件
- 代码示例
- 一、[开发插件](https://cn.vuejs.org/v2/guide/plugins.html#%E5%BC%80%E5%8F%91%E6%8F%92%E4%BB%B6)
- 二、例子
- 三、原理
- 3.1、 和Vue.mixin的差别
- 四、参考文章

</details>

## Vue插件

  

插件通常用来为 Vue 添加全局功能。插件的功能范围没有严格的限制——一般有下面几种：

  

1.  添加全局方法或者属性。如: [vue-custom-element](https://github.com/karol-f/vue-custom-element)

2.  添加全局资源：指令/过滤器/过渡等。如 [vue-touch](https://github.com/vuejs/vue-touch)

3.  通过全局混入来添加一些组件选项。如 [vue-router](https://github.com/vuejs/vue-router)

4.  添加 Vue 实例方法，通过把它们添加到 `Vue.prototype` 上实现。

5.  一个库，提供自己的 API，同时提供上面提到的一个或多个功能。如 [vue-router](https://github.com/vuejs/vue-router)

  

**通过全局方法 `Vue.use()` 使用插件。它需要在你调用 `new Vue()` 启动应用之前完成：**

  

## 代码示例

```js
// 调用 `MyPlugin.install(Vue)`
Vue.use(MyPlugin)

new Vue({
  // ...组件选项
})
```

  

## 一、[开发插件](https://cn.vuejs.org/v2/guide/plugins.html#%E5%BC%80%E5%8F%91%E6%8F%92%E4%BB%B6)

  

Vue.js 的插件应该暴露一个 `install` 方法。这个方法的第一个参数是 `Vue` 构造器，第二个参数是一个可选的选项对象：

  

```js
MyPlugin.install = function (Vue, options) {
  // 1. 添加全局方法或属性
  Vue.myGlobalMethod = function () {
    // 逻辑...
  }// 要访问myGlobalMethod，要使用Vue.myGlobalMethod

  // 2. 添加全局资源
  Vue.directive('my-directive', {
    bind (el, binding, vnode, oldVnode) {
      // 逻辑...
    }
    ...
  })

  // 3. 注入组件选项
  Vue.mixin({
    created: function () {
      // 逻辑...
    }
    ...
  })

  // 4. 添加实例方法
  Vue.prototype.$myMethod = function (methodOptions) {
    // 逻辑...
  }
}
```

  

## 二、例子

  

自己实现一个插件：

  

```js
// plugins/index.js

// 
const MyPlugin = {
 // Vue.js 的插件应该暴露一个 `install` 方法。这个方法的第一个参数是 `Vue` 构造器，第二个参数是一个可选的选项对象：
  install(Vue) {
    Vue.mixin({
      mounted() {
        console.log("Mounted!");
      }
    });
    // 新增一个全局的方法
    Vue.prototype.sayHi = function() {
      console.log("hi~~~~~~~");
    };
    // 新增一个属性HHHname
    Vue.prototype.HHHname = "我是新增的属性name";

    Vue.myGlobalMethod = function() {
      console.log("我是一个全局方法");
    };
  }
};
// Automatic installation if Vue has been added to the global scope.
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(MyPlugin)
}
```

  

在`main.js`中引入该插件，并使用`Vue.use()`方法:

  

```js
import MyPlugin from "./plugins/index";
// 使用该插件
Vue.use(MyPlugin);
// 这样就在根实例中新增了几个公用的方法sayHi，HHHname属性。。。
```

  

## 三、原理

  

用`Vue.mixin`向Vue全局构造函数中添加相应的方法和内容

  

### 3.1、 和Vue.mixin的差别

  

`Vue.mixin`的方法一般是给**根组件**添加的新东西，而插件是给**根实例或者Vue的构造函数**添加的。

  

## 四、参考文章

  

1.  [创建你自己定制的vuejs plugin扩展app的功能](https://www.cnblogs.com/kidsitcn/p/11150914.html)

2.  [vue的插件注册](https://www.jianshu.com/p/4507fa20920d)
