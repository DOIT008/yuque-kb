---
description: "一、定义什么是高阶函数？只要满足以下其中的一个条件：函数可以作为参数被传递函数可以作为返回值输出二、举例2.1、函数作为参数传递回调函数 把函数当作参数传递，这代表我们可以抽离出一部分容易变化的业务逻辑，把这部分业务逻辑放在函数参数中， 这样就可以分离出业务代码中变化和不变的部分，最常见的是回..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pumzol"
updated: "2022-04-20T14:49:05.000Z"
---

# JS专题之——高阶函数

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/pumzol)

::: info 本页结构
- 一、定义
- 二、举例
- 2.1、函数作为参数传递
- 代码示例
- 2.2、函数作为返回值输出（就是return一个函数）
- 2.3、 高阶函数实现AOP
- 2.4 高阶函数的其他应用
:::

## 一、定义

什么是高阶函数？

只要满足以下其中的一个条件：

1.  函数可以作为参数被传递
2.  函数可以作为返回值输出

## 二、举例

### 2.1、函数作为参数传递

1.  **回调函数**

把函数当作参数传递，这代表我们可以**抽离出一部分容易变化的业务逻辑**，把这部分业务逻辑放**在函数参数中**， 这样就可以分离出业务代码中变化和不变的部分，最常见的是回调函数：

## 代码示例

```js
var getUserInfo = function( userId, callback ){ 
   $.ajax( 'http://xxx.com/getUserInfo?' + userId, function( data ){ 
     if ( typeof callback === 'function' ){ 
         callback( data ); 
      } 
   }); 
}

getUserInfo( 13157, function( data ){ 
 alert ( data.userName ); 
});
```

上述在请求到数据的时候可能对数据`data`的操作是多种多样的，如果写死就失去了灵活性，所以在`getUserInfo`中第二个参数是`callback`，这样我们可以根据传入函数的不同来对数据执行不一样的操作，这样就灵活了许多。

> 上述不变的部分是要请求到数据，变化的部分是怎么处理一部请求到的数据，所以要把变化的部分整成函数

2.  **Array.prototype.sort**

我们知道，对数组进行排序经常用的方法就是`arr.sort(callback)`，例如：

```js
let arr = [3,4,1,6,7,12,6,9]
// 升序
arr.sort((a,b)=>{
  return a-b
})

// 降序
arr.sort((a,b)=>{
  return b-a
})

```

`Array.prototype.sort` 接受一个函数当作参数，这个函数里面封装了数组元素的排序规则。从`Array.prototype.sort` 的使用可以看到，我们的**目的是对数组进行排序，这是不变的部分；而使 用什么规则去排序，则是可变的部分**。把可变的部分封装在函数参数里，就会变得很灵活！

### 2.2、函数作为返回值输出（就是return一个函数）

我们判断一个变量是不是数组方式有很多种，其中一种是用 `Object.prototype.toString` 来计算。`Object.prototype.toString.call( obj )`返回一个 字符串，比如 `Object.prototype.toString.call( [1,2,3] )` 总是返回 "`[object Array]`" ， 而 `Object.prototype.toString.call( “str”)`总是返回"`[object String]`"。所以我们可以编写一系列的 `isType` 函数。代码如下 ：

```js
var isString = function( obj ){ 
 return Object.prototype.toString.call( obj ) === '[object String]'; 
}; 
var isArray = function( obj ){ 
 return Object.prototype.toString.call( obj ) === '[object Array]'; 
}; 
var isNumber = function( obj ){ 
 return Object.prototype.toString.call( obj ) === '[object Number]'; 
}; 
```

我们发现，这些函数的大部分实现都是相同的，**不同的只是** `Object.prototype.toString. call( obj )`返回的字符串。为了避免多余的代码，我们尝试把这些**字符串作**为参数提前值入 `isType` 函数。

```js
var isType = function( type ){ 
 return function( obj ){ 
 return Object.prototype.toString.call( obj ) === '[object '+ type +']'; 
 } 
}; 

var isString = isType( 'String' ); 
var isArray = isType( 'Array' ); 
var isNumber = isType( 'Number' ); 
console.log( isArray( [ 1, 2, 3 ] ) ); // 输出：true 
```

### 2.3、 高阶函数实现AOP

AOP（面向切面编程）的**主要作用是把一些跟核心业务逻辑模块无关的功能抽离出来**，这些 跟业务逻辑无关的功能通常包括日志统计、安全控制、异常处理等。把这些功能抽离出来之后， 再根据需要**通过“动态织入”的方式掺入业务逻辑模块中**

### 2.4 高阶函数的其他应用

比如实现节流、函数柯里化(currying)/反柯里化(uncurrying)等，在这里不再赘述

> 一个 currying 的函数首先会接受一些参数，接受了这些参数之后， 该函数并不会立即求值，而是继续返回另外一个函数，刚才传入的参数在函数形成的闭包中被保 存起来。待到函数被真正需要求值的时候，之前传入的所有参数都会被一次性用于求值。
