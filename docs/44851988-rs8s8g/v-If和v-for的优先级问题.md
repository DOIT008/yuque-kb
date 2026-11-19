---
description: "v-If和v-for的优先级问题"
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/amv343"
updated: "2021-01-27T14:49:50.000Z"
---

# v-If和v-for的优先级问题

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/amv343)

**结论是：`v-for`的优先级要比`v-if`的优先级高**

  

分析如下：

  

在`node_modules\vue\src\compiler\codegen\index.js`中有这样一段代码：

  

## 代码示例

```js
// ...
if (el.staticRoot && !el.staticProcessed) {
    return genStatic(el, state)
  } else if (el.once && !el.onceProcessed) {
    return genOnce(el, state)
  } else if (el.for && !el.forProcessed) {
    return genFor(el, state)
  } else if (el.if && !el.ifProcessed) {
    return genIf(el, state)
  } else if (el.tag === 'template' && !el.slotTarget && !state.pre) {
    return genChildren(el, state) || 'void 0'
  } else if (el.tag === 'slot') {
    return genSlot(el, state)
  } else {
   // 。。。
```

  

很明显上面首先判断的是`for`，然后才判断的是`if`，所以`v-for`的优先级要高，我们举例说明

  

如果`v-if` 和`v-for` 同级，像下面这样

  

```vue
<p v-for="(item, index) in children" :key="index" v-if="isShow">
      名字：{{ item.name }},年龄：{{ item.age }}
    </p>
// console.log(this.$options.render)
```

  

我们查看渲染函数`render`：

  

```js

var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "about" },
    [
      _c("h1", [_vm._v("This is an about page")]),
        //_vm._l就是循环渲染列表的函数，列表中有几个就执行几次
      _vm._l(_vm.children, function(item, index) {
        return _vm.isShow// isShow不就是我们的判断条件吗？
          ? _c("p", { key: index }, [
              _vm._v(
                " 名字：" +
                  _vm._s(item.name) +
                  ",年龄：" +
                  _vm._s(item.age) +
                  " "
              )
            ])
          : _vm._e()
      })
    ],
    2
  )
}
```

  

`_vm._l`就是在for循环要执行的函数，另外，在该函数内部有一个三元表达式`_vm.isShow...`，表示如果`isShow` 为真就执行渲染，否则的化就执行`_vm._e()`这个空函数，因为这个三元表达式在函数内部，**所以 `v-for` 的优先级要大于`v-if`**

  

那么问题来了，如果真的要碰到 这样的需求该怎么办呢？

  

答案是在`v-for`的外层裹上一层元素，先判断`v-if`：

  

像这样

  

```vue
<template v-if="isShow">
	<p v-for="(item, index) in children" :key="index">
    	名字：{{ item.name }},年龄：{{ item.age }}
    </p>
</template>
```

  

和上面一样：我们看渲染函数`render`：

  

```js
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    { staticClass: "about" },
    [
      _c("h1", [_vm._v("This is an about page")]),
      _vm.isShow
        ? _vm._l(_vm.children, function(item, index) {
            return _c("p", { key: index }, [
              _vm._v(
                " 名字：" +
                  _vm._s(item.name) +
                  ",年龄：" +
                  _vm._s(item.age) +
                  " "
              )
            ])
          })
        : _vm._e()
    ],
    2
  )
}
```

  

结果和上面的相反，是先进行判断`_vm.isShow`如果为真则执行循环，否则执行`_vm._e()`，这也就是Vue官方要求这样做的原因。

  

## 综上所述

  

1.  `v-for`的优先级要比`v-if` 的优先级高；

2.  如果两者同级，根据我们的`render`函数就知道，不管怎样都会循环执行`_vm._l`函数，然后在每次循环中都要判断是否执行渲染，比较浪费性能；

3.  如果两个不同级，就是先进行判断，然后根据判断决定是否执行循环，性能更高；
