---
description: "AMD（异步模块定义）讲到AMD规范就不得不提到 reqquire.js ，因为requirejs 为全局添加了 define 函数，你只要按照这种约定的方式书写这个模块即可，这里的规范就是AMD规范：你去看 AMD 规范 的内容，其主要内容就是定义了 define 函数该如何书写，只要你按照..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uab2zz"
updated: "2024-08-02T14:51:02.000Z"
---

# JS深入之前端模块加载方案

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uab2zz)

::: info 本页结构
- AMD（异步模块定义）
- require.js
- 代码示例
- CMD
- sea.js
- AMD和CMD的区别
- Common.js
- ES6
- Common.js和ES6
- 参考文章
:::

## AMD（异步模块定义）

讲到AMD规范就不得不提到 `reqquire.js` ，因为`requirejs` 为全局添加了 `define` 函数，你只要按照这种约定的方式书写这个模块即可，这里的规范就是AMD规范：

> 你去看 [AMD 规范](https://github.com/amdjs/amdjs-api/wiki/AMD-\(%E4%B8%AD%E6%96%87%E7%89%88\)) 的内容，其主要内容就是定义了 define 函数该如何书写，只要你按照这个规范书写模块和依赖，require.js 就能正确的进行解析。

## require.js

我们先看一下require.js的使用方法：

目录结构:

![2020-11-08_111338.png](https://cdn.nlark.com/yuque/0/2020/png/1528528/1604805237775-30654e79-5f1c-44dd-8c62-2aaf6f37aae4.png)

index.html

## 代码示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <style lang="css">
       *{
           margin: 0;
           padding: 0;
       } 
       html,body{
        height: 100%;
        width: 100%;
       }
    </style>
</head>
<body>
    <!-- 这里的data-main属性的值设置的是主依赖模块main.js的路径 -->
    <script data-main="js/moduleLoad/main.js" src="js/moduleLoad/require.js" ></script>
</body>
</html>

```

main.js

```js
// 入口文件/主模块，依赖着add模块和multiple模块，函数中的形参依次是两个模块返回的东西,其实是一个对象
define([
    './add',
    './multiple'
], function(addModule, multiple) {
    'use strict';
    console.log(addModule,multiple);
 
});
// 打印结果。。。
{
  add: ƒ (m,n),
	division: ƒ (dividend,divisor)
	...
}
{
  midRequire: ƒ (m,n)
  __proto__: Object
}
```

add.js

```js
// add 模块
// add 模块
define(function(){
    console.log('加载了add模块');
    //加法
    let add = function (m,n) {
        return m+n
    }
    // 除法
    let division = function(dividend,divisor){
        if(divisor==0){ 
            return console.error('除数不能为0！')
        }
        return dividend/divisor
    }
    return {
        add:add,
        division:division
    }
})
```

multiple.js

```js
// multiple模块依赖midRequire模块,midRequire模块是一个乘法函数
define([
    './midRequire',
], function(midRequire) {
    'use strict';
    return {
        midRequire:midRequire.mulCalc
    }
});
```

midRequire.js

```js
// 乘法运算
define(function(){
    let mulCalc = function (m,n){
        return m*n
    }
    return {
        mulCalc:mulCalc
    }
})
```

## CMD

## sea.js

在国内，经常与 AMD 被一起提起的还有 CMD，CMD 又是什么呢？我们从 `sea.js` 的使用开始说起。

​  

main.js

```js
// main.js
define(function(require,exports,module){
    var addModule = require('./add');
    console.log(addModule);
    var divisionModule = require('./division');
    console.log(divisionModule);
})

//加载了add模块
// {add: ƒ}
// {division: ƒ}

```

add.js

```js
define(function(require,exports,module){
    console.log('加载了add模块');
    let add = function(m,n){
        return m+n
    }
    module.exports = {
        add:add
    }
})
```

division.js

```js
define(function(require,exports,module){
    let devision = require('./midModule');
    module.exports = {
        division:devision.divisonFunc
    }
})
```

midModule.js

```js
define(function(require,exports,module){
    let divisonFunc = function(m,n){
        if(n==0){
            return console.error('除数不能为0！')
        }
        return m/n
    }
    module.exports = {
        divisonFunc:divisonFunc
    }
})
```

## AMD和CMD的区别

1.  CMD 推崇**依赖就近(就是依赖在真正需要的时候再写)**，AMD 推崇**依赖前置（必须先引进来，用不用就是另一回事了）,**这个区别在main.js里面就有体现。
2.  AMD 是将需要使用的模块先加载完再执行代码，而 CMD 是在 require 的时候才去加载模块文件，加载完再接着执行。

## Common.js

AMD 和 CMD 都是用于浏览器端的模块规范，**而在服务器端比如 node，****采用的则是 CommonJS 规范。****​**

导出模块的方式：

```js
var add = function(x, y) {　
    return x + y;
};

module.exports.add = add;
// 其实导出的是一个对象，上面的写法可以是module.exports = {add:add}
```

引入模块的方式：

```js
var add = require('./add.js');
console.log(add.add(1, 1));
```

> 但无论require多少次，模块永远是单例，也就是说只有第一次require的时候会被加载，以后再require其实加载的是缓存

我们将之前的代码改成符合Common.js规范的代码：

main.js

```js
var addModule = require('./add.js');
 console.log(addModule);
 var divisionModule = require('./division.js');
 console.log(divisionModule);
```

add.js

```js
 let add = function(m,n){
        return m+n
 }
 module.exports = {
      add:add
 }
```

midModule.js

```js
let divisonFunc = function(m,n){
        if(n==0){
            return console.error('除数不能为0！')
        }
        return m/n
    }
    module.exports = {
        divisonFunc:divisonFunc
    }
```

division.js

```js
let devision = require('./midModule');
    module.exports = {
        division:devision.divisonFunc
    }
```

## ES6

使用export

main.js

```js
let add = function(m,n){
	return m+n
}
let personName = "张三";
// 默认导出
export {add,personName}
// 方式2
export add
export personName
// 命名导出，引入的时候使用myAdd
export {add as myAdd}

```

引入

```js
import {add，personName} from "./main.js"
```

## Common.js和ES6

引用阮一峰老师的 [《ECMAScript 6 入门》](http://es6.ruanyifeng.com/#docs/module-loader)：

> 它们有两个重大差异。
> 
> 1.  CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
> 2.  CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。

第二个差异可以从两个项目的打印结果看出，导致这种差别的原因是：

> 因为 CommonJS 加载的是一个对象（即module.exports属性），该对象只有在脚本运行完才会生成。而 ES6 模块不是对象，它的对外接口只是一种静态定义，在代码静态解析阶段就会生成。

重点解释第一个差异。

> CommonJS 模块输出的是值的拷贝，也就是说，一旦输出一个值，模块内部的变化就影响不到这个值。

## 参考文章

1.  [ES6 系列之模块加载方案](https://github.com/mqyqingfeng/Blog/issues/108)
