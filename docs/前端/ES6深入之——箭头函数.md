---
description: "基本用法返回对象如果用箭头函数返回一个对象，则需要用括号 ​()​ 括起来。let func = (val,num)=&gt;({total:val*num}); console.log(func(100,12));变量的解耦// 箭头函数变量的解耦操作，以上述函数为例,结构参数对象中的val和nu..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/vyeum8"
updated: "2022-12-26T12:40:33.000Z"
---

# ES6深入之——箭头函数

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/vyeum8)

<details class="toc-details">
<summary>本页结构（10 个小节）</summary>

- 基本用法
- 返回对象
- 代码示例
- 变量的解耦
- 箭头函数中的this
- 没有arguments
- 不能通过new关键字调用
- 没有new.target
- 没有原型
- 没有 super

</details>

## 基本用法

## 返回对象

如果用箭头函数返回一个对象，则需要用括号 `()` 括起来。

## 代码示例

```js
let func = (val,num)=>({total:val*num});
console.log(func(100,12));
```

## 变量的解耦

```js
// 箭头函数变量的解耦操作，以上述函数为例,结构参数对象中的val和num
let func1 =  ({val,num})=>({
    total:val*num
})

let obj1 = {
    val:123,
    num:3
}
console.log(func1(obj1));
```

## 箭头函数中的this

如果箭头函数被非箭头函数包含，this 绑定的就是最近一层非箭头函数的 this

```js
// 箭头函数中的this；
let func2 = ()=>{
    console.log(this);
} 
func2()// window,因为该箭头函数外层没有其他非箭头函数，如果没有，就会指向window

let obj3 = {
    func3:()=>{
        console.log(this);
    }
}
obj3.func3()//window,原因同上
function func4() {
    return ()=>{
        console.log(this)
    }
}

func4()()//window,因为外层函数func4的this是window，所以内部箭头函数中的this就是window

let obj4 = {
    func4:function(){
        return ()=>{
            console.log(this);
        }
    }
}

obj4.func4()()// obj4，因为func4的调用者是obj4，所以func4内部的this也是obj4，所以根据原理箭头函数中的this指向obj4
```

## 没有arguments

箭头函数没有自己的 arguments 对象，但可以访问外围函数的 arguments 对象：

```js
function func5() {
    return ()=>arguments[0]
}
console.log(func5(1)());//1，外围函数的arguments的第一个元素是1，所以...
```

## 不能通过new关键字调用

JavaScript 函数有两个内部方法： `[[Call]]`  和 `[[Construct]]` 。

当通过 `new`  调用函数时，执行 `[[Construct]]`  方法，创建一个实例对象，然后再执行函数体，将 `this`  绑定到实例上。

当直接调用的时候，执行 `[[Call]]`  方法，直接执行函数体。

箭头函数并没有 `[[Construct]]`  方法，不能被用作构造函数，如果通过 `new`  的方式调用，会报错。

## 没有new.target

因为不能使用 `new`  调用，所以也没有 `new.target`  值。

  

> ES6 为`new`命令引入了一个`new.target`属性，该属性一般用在构造函数之中，返回`new`命令作用于的那个构造函数。如果构造函数不是通过`new`命令或`Reflect.construct()`调用的，`new.target`会返回`undefined`，因此这个属性可以用来确定构造函数是怎么调用的。

```js
// new.target
function Foo() {
    console.log(new.target);
}

var foo = new Foo()
```

  

## 没有原型

因为我们不能使用new来调用箭头函数，所以就没有原型存在的必要性，所以箭头函数的原型是 `indefined` 

```js
// 没有原型
const Foo1 = ()=>{

}

console.log(Foo1.prototype);//undefined
```

## 没有 super

super的作用是继承，箭头函数连原型都没有，更别说super了
