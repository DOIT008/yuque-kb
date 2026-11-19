---
description: "定义我们先看一下MDN上的定义：Object.create(proto,[propertiesObject])proto:新创建对象的原型对象propertiesObject:可选。要添加到新对象的可枚举（新添加的属性是其自身的属性，而不是其原型链上的属性）的属性。不过这里要注意的是该对象不是..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ru4quw"
updated: "2020-10-25T02:55:07.000Z"
---

# 从Object.create()说开去

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ru4quw)

::: info 本页结构
- 定义
- 代码示例
- Object.create()和{...}的区别
- Object.create(null)的使用场景
- 参考文章
:::

## 定义

我们先看一下MDN上的定义：

## 代码示例

```js
Object.create(proto,[propertiesObject])
```

-   proto:新创建对象的原型对象
-   propertiesObject:可选。要添加到新对象的**可枚举**（新添加的属性是其自身的属性，而不是其原型链上的属性）的属性。不过这里要注意的是该对象不是我们经常写的那种形式——

```js
{
	name:'张三',
  age:14
}
```

而是像这种形式——

```js
{
	name:{
  	value:"张三",
    get(){},
    set(){}
    ...
  }
}
```

举个很简单的例子——

```js
const person = {
    name:'张三',
    play:function(){
        console.log(`${this.name}正在吃${this.food}`);
    },
    food:'饺子'
}

const people = Object.create(person);
people.name = "李四";//向people对象添加自身属性name
people.food = "面条";// 同上
people.play()// 李四正在吃面条,因为访问的是对象本身的属性
```

## Object.create()和{...}的区别

使用{...}

```js
var obj = {a:1}
console.log(obj)// 有原型对象
```

使用Object.create()

```js
var obj = Object.create(null,{
	a:{
  	value:1,
    writable:true,
    configable:true
  }
})
console.log(obj)//你会发现obj没有原型对象
```

那如果是这样呢？

```js
var obj = Object.create({},{
	a:{
  	value:1,
    writable:true,
    configable:true
  }
})
console.log(obj)//你会发现obj没有原型对象
```

你会发现是这样的——

![162b2ef45967219d.png](https://cdn.nlark.com/yuque/0/2020/png/1528528/1603593415529-115bf3d7-9773-435c-88cd-30a7bb4057b5.png)

多了一层，所以如果要和最初的一样，就要这样使用：

```js
var obj = Object.create({}.__proto__,{
	a:{
  	value:1,
    writable:true,
    configable:true
  }
})
```

这样就和使用{...}一模一样了

## Object.create(null)的使用场景

这样的一个对象——

```js
let obj = Object.create(null);
console.log(obj)
```

你会发现obj对象非常纯净，纯净到连原型对象都没有，这样就不用担心我们在创建对象的时候覆盖掉原型上的方法了，这种对象我们可以自定义其一切属性包括原型对象，**当我们创建一个高度自定义的数据字典对象的时候特别有用。**

## 参考文章

1.  [详解Object.create(null)](https://juejin.im/post/6844903589815517192)
