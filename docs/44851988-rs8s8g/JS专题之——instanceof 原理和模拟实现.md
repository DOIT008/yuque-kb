---
description: "前言在面试中 instanceof 经常和 typeof 放在一起问，那么今天我们就来看一下两者究竟有啥区别？instanceof和typeof的区别instanceof 通常用来判断某个实例是否属于某个父类或者祖父类的实例（最常见的就是构造函数生成的实力和构造函数之间的关系），如果是则返回 ..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/socmw1"
updated: "2024-07-31T14:19:46.000Z"
---

# JS专题之——instanceof 原理和模拟实现

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/socmw1)

## 前言

在面试中 `instanceof` 经常和 `typeof` 放在一起问，那么今天我们就来看一下两者究竟有啥区别？

## instanceof和typeof的区别

1.  `instanceof` 通常用来判断某个实例是否属于某个父类或者祖父类的实例（最常见的就是构造函数生成的实力和构造函数之间的关系），如果是则返回 `true` ，否则则是 `false` 。
2.  `typeof`  用来判断某个变量的数据类型（number，string，boolean，undefined，object，function），对于 `null` 和数组，也返回 `object` ；通常用来区分基础类型的数据

用法如下：

## 代码示例

```js
typeof abc //返回string，number，boolean,object,undefined,funtion
 abc instanceof Array,Object// 返回true或者false
```

## instanceof的原理

**只要右边变量的 prototype 在左边变量的原型链上即可**。因此， `instanceof`  在查找的过程中会遍历左边变量的原型链，直到找到右边变量的 `prototype` ，如果查找失败，则会返回 `false` 。

## 模拟实现

根据上面的原理，直接上代码——

```js
function myInstanceof(a,b) {
    // 拿到a的原型
    let aProto = a.__proto__;
    // 拿到b的原型
    let bProto = b.prototype;
    while (true) {
        // 如果a的原型是null，直接返回false
        if(aProto===null){
            return false
        }else if(aProto===bProto){
            return true
        }
        aProto = aProto.__proto__
    }
}
```

​
