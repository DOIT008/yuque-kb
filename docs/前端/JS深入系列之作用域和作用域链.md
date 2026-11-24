---
description: "作用域与动态作用域作用域就是变量存储，被访问的一套规则，对于js而言，其作用域是词法作用域，也就是说某个函数的作用域是在该函数被定义的时候就已经确定了，所以词法作用域又称静态作用域。上代码：var value = 1;  function foo() {     console.log(val..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/izuhd6"
updated: "2024-07-31T14:26:53.000Z"
---

# JS深入系列之作用域和作用域链

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/izuhd6)

<details class="toc-details">
<summary>本页结构（7 个小节）</summary>

- 作用域与动态作用域
- 代码示例
- 作用域链
- 函数创建
- 函数激活（开始执行前）
- 块作用域
- 参考文章

</details>

![timg (1).png](/images/2433769b6e499477.png)

## 作用域与动态作用域

作用域就是变量存储，被访问的一套规则，对于js而言，其作用域是词法作用域，也就是说**某个函数的作用域是在该函数被定义的时候****就已经确定了**，所以词法作用域又称静态作用域。上代码：

## 代码示例

```js
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();//1
```

为什么呢？

其实就是因为 `js` 是静态作用域的原因，捡重点说，当 `foo` 函数执行的时候由于自己函数体内没有 `value` ，所以就要沿着作用域链寻找，而作用域链在书写代码的时候就已经确定了---因为 `foo` 函数是在全局作用域中定义的，所以自然而然的找到了全局作用域中的 `value` 结果为 `1` 

    与之相对应的是动态作用域，其作用域是在函数被执行的时候才确定，bash语言就是动态作用域

再举个例子就更能说明问题了：

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f();
}
checkscope();
```

 

```js
var scope = "global scope";
function checkscope(){
    var scope = "local scope";
    function f(){
        return scope;
    }
    return f;
}
checkscope()();
```

两者会输出什么呢？

和上面的道理一样，f函数是在 `checkscope` 函数内部定义的，所以其父作用域就是 `checkscope` 的作用域，所以在寻找变量是 `scope` 的时候，往父级就找到了 `checkscope` 内的变量也就是 `local scope`  ，同样的道理后面的例子也是如此。

## 作用域链

**作用域链是查找变量的一套规则**，也就是说，当函数中要查找某个变量，如果在当前作用域没找到，就从找他的父亲中寻找，这里的父亲是当前函数定义时所在位置(你写的位置)的作用域，所以作用域链是也静态的(因为写代码的时候就已经确定了)。

### 函数创建

上面已经说了，在函数创建(或者函数被写出来的那一瞬间)，该函数的作用域已经确定了，这是因为函数有一个内部属性 `[[scope]]` ，当函数创建的时候，就会**保存所有父变量****(该函数作用域的所有父级作用域)****对象到其中**，**你可以理解 \[\[scope\]\] 就是所有父变量对象的层级链。**

举个例子：

```js
function foo() {
    function bar() {
        ...
    }
}
```

函数创建时，各自的\[\[scope\]\]为：

```js
foo.[[scope]] = [
  globalContext.VO
];
bar.[[scope]] = [
    fooContext.AO,// 这里为啥是AO呢，因为这个时候foo函数已经执行了所以变量对象VO被激活了
    globalContext.VO
];
```

### 函数激活（开始执行前）

当函数激活时，进入函数上下文，创建 VO/AO 后，就会将活动对象添加到作用链的前端，因为这个是自己的作用域，肯定要在顶端了

这时候执行上下文的作用域链，我们命名为 Scope：

```js
Scope = [AO].concat([[Scope]]);复制代码
```

至此，作用域链创建完毕。

  

## 块作用域

使用let和const声明的变量，只能在声明所在的块被访问到，这个块通常是{…}，并且不存在声明提升，但是var声明的变量就会存在变量提升的，这里的提升指的是提升到变量所在作用域的顶部。

  

## 参考文章

1.  [JavaScript深入之作用域链](https://juejin.im/post/58ed9c0ea0bb9f006a4c28cd)

  

  

  

##
