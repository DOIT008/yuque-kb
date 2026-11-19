---
description: "和词法作用域相反，函数内this的指向是在函数调用的时候确定的，this的指向于当前函数的最直接的调用者！总结下面做个总结，以foo函数为例：foo函数前面啥也没有，this指向window类似obj.foo()，this指向obj，如果是obj1.obj2.foo()，this是指向obj2..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/wipd0p"
updated: "2020-06-11T14:34:16.000Z"
---

# JS深入系列之this

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/wipd0p)

::: info 本页结构
- 总结
- 一些重点例子
- 针对 上述结论2的例子
- 代码示例
- 针对箭头函数中的this
- 参考网站
:::

![582aab54143d5.png](/images/562fa8bedd91a919.png)

和词法作用域相反，函数内this的指向是在函数调用的时候确定的，this的指向于当前函数的最直接的调用者！

## 总结

下面做个总结，以foo函数为例：

1.  foo函数前面啥也没有，this指向window
2.  类似obj.foo()，this指向obj，如果是obj1.obj2.foo()，this是指向obj2，因为obj2更近
3.  bind,call,apply则指向其第一个参数
4.  new出来的构造函数实例，this指向该实例
5.  **箭头函数的 this 始终指向箭头函数定义时所处环境的 this，而非执行时**，箭头函数需要记着这句话：“箭头函数中没有 this 绑定，必须通过**查找作用域链来决定其值（既然是作用域链嘛，那就是词法作用域咯，跟函数声明的位置有关）**，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 window”

## 一些重点例子

### 针对 上述结论2的例子

## 代码示例

```js
var obj = {
    name:'李四',
    innerObj:{
        name:'张三',
        age:23,
        say:function(){
            console.log(this.name);
        }
    }
}
obj.innerObj.say()// 张三
```

### 针对箭头函数中的this

```js
var obj = {
    name:"李白",
    say:()=>{
        console.log(this.name)
    }
}
obj.say()// undefined

```

为什么？这是因为箭头函数里面的this默认和最外层的 `this` 保持一致，在上面的例子中最外层的 `this` 是 `window` ，而全局作用域中并没有 `name` 这个变量，所以...

除此之外箭头函数中的this还是有其他特性。

1.  **对于箭头函数，不能使用call方法来修改里面的this**

```js
const obj = {
    a: () => {
        console.log(this)
    }
}
obj.a.call('123')  //打出来的结果依然是window对象
```

在上面 `obj.a` 是一个箭头函数， `obj.a.call('123')` 是想把 `a` 函数中的 `this` 绑定给 `123` 并执行 `a` 函数，但打印出来的是 `window` 。

2.  **多层对象嵌套中箭头函数的this，指向最外层的对象**

```js
const obj = {
    a: function() { console.log(this) },
    b: {
    	c: () => {console.log(this)}
	}
}
obj.a()   //没有使用箭头函数打出的是obj
obj.b.c()  //打出的是window对象！！

```

对于 `obj.b.c()` 而言最外层的对象是 `window` ，所以就打印出了 `window` ,其实这个也符合本文最开始的箭头函数的结论---**箭头函数的 this 始终指向函数定义时的 this,**上面的箭头函数 `c` 定义时其父作用域就是 `window` ，所以...

3.  **没有非箭头函数包裹箭头函数的this，指向window**

```js
// 定时器
setTimeout(()=>{
    console.log(this);
},1000)// window

```

  

  

## 参考网站

1.  [this、call、apply、bind](https://juejin.im/post/59bfe84351882531b730bac2)
2.  [JS中的箭头函数与this](https://juejin.im/post/5aa1eb056fb9a028b77a66fd)
