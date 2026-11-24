---
description: "什么是类数组呢?——其实就是那些有length属性和若干索引的对象，比如：// 类似数组的东西，索引哦，0，1，2,还有length属性 var obj ={     0:'张三',     1:12,     2:'男',     length:3 }  // 真正的数组 var array..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pxxa2k"
updated: "2020-08-07T00:10:02.000Z"
---

# JS深入之类数组和数组

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pxxa2k)

什么是类数组呢?——其实就是那些有length属性和若干索引的对象，比如：

## 代码示例

```js
// 类似数组的东西，索引哦，0，1，2,还有length属性
var obj ={
    0:'张三',
    1:12,
    2:'男',
    length:3
}

// 真正的数组
var array = ['张三',23,'男']
```

其本质还是一个对象，当然不能使用那些操作数组的方法啦

## arguments

当然我们最常见的就是函数中的arguments对象：

```js

function foo(a,b) {
    console.log(arguments);// 一个对象，但是有length属性
    console.log(arguments instanceof Array);// false
    console.log(arguments instanceof Object);// true
    return a+b
}
foo()
```

## 转为真正的数组

```js
// 对象转数组slice
Array.prototype.slice.call(obj)

// 对象转数组splice
Array.prototype.splice.call(obj,0)

// 对象转数组之from
Array.from(obj)

// 对象转数组之concat
Array.prototype.concat.apply([],obj)

```
