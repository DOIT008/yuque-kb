---
description: "定义new 运算符创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。 ——（来自于MDN）我们经常使用new来创建一个构造函数的实例，例如：function Car(color) {     this.color = color }  Car.prototype.startEng..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/xxosgg"
updated: "2020-08-05T11:27:54.000Z"
---

# JS专题之——模拟实现new

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/xxosgg)

## 定义

  

> **new 运算符**创建一个用户定义的对象类型的实例或具有构造函数的内置对象的实例。 ——（来自于MDN）

  

我们经常使用new来创建一个构造函数的实例，例如：

## 代码示例

```js
function Car(color) {
    this.color = color
}

Car.prototype.startEngine = function(){
    console.log(this.color)
}

var car = new Car('white')
car.startEngine()//white
```

## 模拟实现

### 原理

其实new做了以下几个事情：

1.  创建了一个空对象(因为我们得到的本身就是一个对象)
2.  新创建的对象原型指向构造函数的原型
3.  执行构造函数并将构造函数内部的this指向新创建的对象( call, apply)
4.  返回新创建的对象

### 实现

下面是模拟实现new的过程：

```js
// 模拟实现new --create(Car,params)
function create () {
    // 创建一个新对象
    var obj = new Object();

    var Con = [].shift.call(arguments);// 是create的第一个参数，也就是构造函数本身（Con）
    // 将对象的原型指向构造函数Con的原型
    obj.__proto__ = Con.prototype
    // 执行构造函数Con，并将其内部的this指向obj---call,这里的arguments已经是从第二个参数开始了
    Con.apply(obj,arguments)
    // 返回新的对象
    return obj
}

var car1 = create(Car,'black');
console.log(car1);
car1.startEngine()//black
```

  

## 参考文章

1.  [深度解析 new 原理及模拟实现](https://juejin.im/post/6844903736666488846)
