---
description: "call，apply，bind的用法callvar obj = {     value:123 }  function getValue() {     console.log(this.value); }  getValue.call(obj)//123模拟实现思路首先 call2 方法肯定..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/mlzb5r"
updated: "2022-12-26T12:38:33.000Z"
---

# JS专题之——模拟实现call, apply和bind

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/mlzb5r)

## call，apply，bind的用法

## call

```js
var obj = {
    value:123
}

function getValue() {
    console.log(this.value);
}

getValue.call(obj)//123
```

## 模拟实现

## 思路

1.  首先 `call2` 方法肯定是所有函数共有的方法，所以 `call2` 方法肯定是在Function的原型上的，注意使用 `this` 
2.  根据 `call` 的用法，该函数的第一个参数表示函数实例中的this

所以，如果我们把 `getValue` 函数放在对象中，然后在对象中调用不就行啦？然后删除新增的方法 `foo` 

## 代码实现第一步

```js
var obj = {
    value:123
}

// 模拟实现
Function.prototype.call2=function(context){
    // 这里的this就是函数实例，这一步相当于在context对象中新增了一个方法foo
    context.foo = this
    // 执行该方法，方法的调用者是context，所以方法内部的this指向context
    context.foo()
    // 删除该方法
    delete context.foo
}

getValue.call2(obj)
```

## 代码实现可以传参

call方法的第一个参数是函数内部的this对象，从第二个参数起就是函数内部的形参，由于函数参数不确定，所以需要使用 `arguments` ，具体实现：

```js
function getValue(name,age) {
    console.log(this.value,name,age);
}

getValue.call(obj)//123

// 模拟实现，带参数
Function.prototype.call2=function(context){
    // 这里的this就是函数实例，这一步相当于在context对象中新增了一个方法foo
    // 因为函数内部的参数不确定有几个，使用arguments为foo函数传参，
    context.foo = this
    // 执行该方法，方法的调用者是context，所以方法内部的this指向context
    // arguments是类似数组的对象，但并不是数组所以需要使用Array.from将其转化为数组，并截取第1个元素后的所有元素
    context.foo(...Array.from(arguments).slice(1))
    // 删除该方法
    delete context.foo
}

getValue.call2(obj,'马占山',45)// 123 马占山 45
```

## 异常情况处理

对于call而言，如果第一个参数穿的是 `null` 或者 `undefined` 那么函数内部的this指向的是 `window` （浏览器）

![code.png](/images/2a64311afb08cad5.png)

  

  

##
