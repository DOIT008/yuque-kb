---
description: "一、作用其实Vue的渲染函数就是用来创建组件的另一种方法，除了html模板的方式之外.二、怎么使用Vue.component(组件名,{     // props, data, computed,生命周期钩子等，各种配置项...     render(){         // somecod..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/wh647b"
updated: "2020-07-16T02:32:51.000Z"
---

# Vue的render函数及应用

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/wh647b)

<details class="toc-details">
<summary>本页结构（5 个小节）</summary>

- 一、作用
- 二、怎么使用
- 代码示例
- 三、原理
- 四、应用--函数式组件

</details>

### 一、作用

  

其实Vue的渲染函数就是用来创建组件的另一种方法，除了html模板的方式之外.

  

### 二、怎么使用

  

## 代码示例

```js
Vue.component(组件名,{
    // props, data, computed,生命周期钩子等，各种配置项...
    render(){
        // somecode...
        return h('一般是标签名'，{配置对象},[children])
        //h函数的第一个参数可以是一个标签名，也可以是一个组件配置对象compo，也可以是一个函数
        //第二个参数是一个配置对象，具体可以参考vue官网搜索jsx
        //第三个参数是一个数组，里面还可以是h函数返回的vnode，也可以是文本等
    }
})
```

上述配置对象里面可以绑定class, style, prop，绑定事件等

> 上述注册的组件是全局组件，注册养成之后即可在任何组件里直接使用即可。

  

心得体会：在使用这种方法注册全局组件的时候，我们**要想清楚两件事，第一组件在使用的时候长啥样(不妨写个模板)，第二组件渲染出来的到底是啥东东（写个模板）**

实例

  

```js
Vue.component("heading", {
  props: ["level", "title", "icon"],
  render(h) {
    let children = [];
    // 添加图标功能
    // <svg><use xlink:use="#icon-xxx"></use></svg>
    if (this.icon) {
      children.push(
        h("svg", { class: "icon" }, [
          h("use", { attrs: { "xlink:href": "#icon-" + this.icon } })
        ])
      );
      children = children.concat(this.$slots.default);
    }
    vnode = h(
      "h" + level,
      { attrs: { this.title } }, // 之前省略了title的处理
      children
    );
    console.log(vnode);
    return vnode;
  }
});
```

  

### 三、原理

  

`h`函数，实际上是`createElement`的缩写，该函数实际上创建了一个虚拟DOM`vnode`（一个包含了真实DOM的各种配置对象）,然后通过`render`函数来进行渲染。

  

参考官网的文章：[https://cn.vuejs.org/v2/guide/render-function.html#ad](https://cn.vuejs.org/v2/guide/render-function.html#ad)

  

### 四、应用--函数式组件

  

组件**没有管理任何状态**，也**没有监听任何传递给它的状态**，也**没有生命周期方法**时，可以将组件标记为

  

functional ，这意味它无状态 (没有响应式数据)，也没有实例 (没有 this 上下文)。

  

**优点**:更加轻量

  

例如还是上面的组件：

  

```js
Vue.component("heading", {
  functional: true, //标记函数式组件
  props: ["level", "title", "icon"],
  render(h, context) {
    //上下文传参使用context
    let children = [];
    // 属性获取
    const { icon, title, level } = context.props;
    if (icon) {
      children.push(
        h("svg", { class: "icon" }, [
          h("use", { attrs: { "xlink:href": "#icon-" + icon } })
        ])
      );
      // 子元素获取
      children = children.concat(context.children);
    }
    vnode = h("h" + level, { attrs: { title } }, children);
    console.log(vnode);
    return vnode;
  }
});
```
