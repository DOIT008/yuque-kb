---
description: "Vue自定义指令除了默认设置的核心指令( v-model 和v-show)，Vue 也允许注册自定义指令。在Vue里，代码复用的主要形式和抽象是组件。然而，有的情况下，仍然需要对纯 DOM 元素进行底层操作，这时候就会用到自定义指令。一、指令的定义有两种的定义指令的方法：全局定义全局定义的指令..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ggo8dg"
updated: "2020-06-14T01:55:16.000Z"
---

# Vue自定义指令

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ggo8dg)

<details class="toc-details">
<summary>本页结构（7 个小节）</summary>

- 一、指令的定义
- 代码示例
- 二、指令的钩子函数
- 三、指令的参数
- 四、指令的简写
- 简写
- 对象字面量的形式

</details>

除了默认设置的核心指令( `v-model` 和`v-show`)，`Vue` 也允许注册自定义指令。在`Vue`里，代码复用的主要形式和抽象是组件。然而，有的情况下，**仍然需要对纯 DOM 元素进行底层操作，这时候就会用到自定义指令**。

  

## 一、指令的定义

  

有两种的定义指令的方法：

  

**全局定义**

  

全局定义的指令在任何组件上都可以使用

  

## 代码示例

```js
// 注册一个全局自定义指令 v-focus
Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。
  inserted: function (el) {
    // 聚焦元素
    el.focus()
  }
})
```

  

**局部定义**

  

局部定义的指令只能在当前组件上使用

  

```js
var vm = new Vue({
  el: '#app',
  directives:{
    focus:{//定义一个名为focus的指令
        // 钩子函数
      inserted: function (el,binding,vnode,oldVnode) {
        el.focus()
      },
       
    }
  }
})
```

  

> 使用指令的时候一定要加上`v-`前缀

  

## 二、指令的钩子函数

  

指令定义函数提供了几个钩子函数（可选） 。

  

**【bind】**：只调用一次，指令第一次绑定到元素(也可能是组件)时调用，用这个钩子函数可以定义一个在绑定时执行一次的初始化动作。

  

**【inserted】**：被绑定元素插入父节点时调用（父节点存在即可调用，不必存在于 `document` 中）。

  

**【update】**：所在组件的 `VNode` 更新时调用，但是可能发生在其孩子的 `VNode` 更新之前。指令的值可能发生了改变也可能没有。但是可以通过比较更新前后的值来忽略不必要的模板更新。

  

**【componentUpdated】**：所在组件的 `VNode` 及其孩子的 `VNode` 全部更新时调用。

  

**【unbind】**：只调用一次， 指令与元素解绑时调用。

  

## 三、指令的参数

  

钩子函数被赋予了以下参数

  

**【el】**：指令所绑定的元素，可以用来直接操作 `DOM`，可以打印出来看一下。

  

**【binding】**：一个对象，包含以下属性：

  

> `name`: 指令名，不包括 v- 前缀。  
> `value`: 指令的绑定值， 例如： `v-my-directive="1 + 1"`, `value` 的值是`2`，也就是说当你定义一个指令的时候，该指绑定的值是`value`  
> `oldValue`: 指令绑定的前一个值，仅在 `update` 和 `componentUpdated` 钩子中可用。无论值是否改变都可用。  
> `expression`: 绑定值的字符串形式。 例如 `v-my-directive="1 + 1"` ， `expression` 的值是 `"1 + 1"`。  
> `arg`: 传给指令的参数。例如 `v-my-directive:foo`， `arg` 的值是 `"foo"`。  
> `modifiers`: 一个包含修饰符的对象。 例如：`v-my-directive.foo.bar`, 修饰符对象 `modifiers` 的值是 `{ foo: true, bar: true }`。

  

**【vnode】**：`Vue` 编译生成的虚拟节点。

  

**【oldVnode】**：上一个虚拟节点，仅在 `update` 和 `componentUpdated` 钩子中可用。

  

> **\[注意\]除了 el 之外（也就是说可以给el上添加属性，事件等），其它参数都是只读的，尽量不要修改他们。如果需要在钩子之间共享数据，建议通过元素的 dataset 来进行。**

  

下面是一个使用了这些参数的自定义钩子样例：

  

```html
<div id="app" v-demo:foo.a.b="message"></div>
```

  

```vue
<script>
    Vue.directive('demo', {
      bind: function (el, binding, vnode) {
        var s = JSON.stringify
        el.innerHTML =
          'name: '       + s(binding.name) + '<br>' +
          'value: '      + s(binding.value) + '<br>' +
          'expression: ' + s(binding.expression) + '<br>' +
          'argument: '   + s(binding.arg) + '<br>' +
          'modifiers: '  + s(binding.modifiers) + '<br>' +
          'vnode keys: ' + Object.keys(vnode).join(', ')
      }
    });
    new Vue({
      el: '#app',
      data: {
        message: 'hello!'
      }
    })
</script>
```

  

![效果图](//upload-images.jianshu.io/upload_images/15401334-394c8d733de501c1.png?imageMogr2/auto-orient/strip%7CimageView2/2/format/webp)

  

## 四、指令的简写

  

### 简写

  

大多数情况下，可能想在`bind`和`update`钩子上做重复动作，并且不想关心其它的钩子函数。可以这样写：

  

```js
Vue.directive('color-swatch', function (el, binding) {
  el.style.backgroundColor = binding.value
})
```

  

### 对象字面量的形式

  

如果指令需要多个值，可以传入一个`JS`对象字面量，指令函数能够接受所有合法类型的`JS`表达式。

  

```html
<div v-demo="{ color: 'white', text: 'hello!' }"></div>
// 指令绑定的值都在钩子函数的参数binding里，所以上面的写法很容易理解,无非此时的value是一个对象
```

  

```js
Vue.directive('demo', function (el, binding) {
  console.log(binding.value.color) // => "white"
  console.log(binding.value.text)  // => "hello!"
})
```
