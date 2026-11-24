---
description: "防抖背景在页面中我们可能需要在诸如鼠标移动(mousemove)，输入框输入(input)等容易频繁触发的事件中来执行某个函数，但是如果频繁执行容易造成页面性能的下降甚至会导致页面崩溃(比如在执行页面异步请求的时候)，所以我们需要在事件频繁触发的时候，只执行最后一次的触发原理事件多次触发，我们..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/arql4q"
updated: "2023-08-07T14:53:57.000Z"
---

# JS深入之函数防抖和节流

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/arql4q)

<details class="toc-details">
<summary>本页结构（10 个小节）</summary>

- 
- 防抖
- 背景
- 原理
- 实现
- 代码示例
- 节流
- 背景
- 原理
- 实现

</details>

## 

![timg.jpg](/images/00e173699d694606.jpg)

## 防抖

## 背景

在页面中我们可能需要在诸如鼠标移动(`mousemove`)，输入框输入(`input`)等容易频繁触发的事件中来执行某个函数，但是如果频繁执行容易造成页面性能的下降甚至会导致页面崩溃(比如在执行页面异步请求的时候)，所以我们需要在事件频繁触发的时候，只执行最后一次的触发

## 原理

事件多次触发，我们只在最后一次触发后n秒内执行，在n秒内如果依然触发，则清空定时器，从新的定时器开始。

## 实现

## 代码示例

```js
//函数防抖,函数防抖的原理是无论你如何触发，触发的多么频繁，我就在你最后一次触发的n秒后执行
document.onmousemove = debounce(recordEvent,1000)

function recordEvent() {
    console.log('鼠标移动了');
}

/**
 * @param {*} fn
 * @param {*} time
 * @returns
 */
function debounce(fn,time) {
    // fn是要执行的函数,每次
    var timeout;
    return function(){
        clearTimeout(timeout);// 关键，清空上一次的计时器，开启新的计时器
        timeout = setTimeout(()=>{
            fn.call(this)
        },time)
    }
}

// document.addEventListener("mousemove",debounce(recordEvent,1000));
```

为什么要使用 `call` ?

这是因为要固定 `fn` 内部的 `this` ，根据箭头函数内部 `this` 的指向规律，这里的 `this` 指向的是 `return function` 中的 `this` ，也就是事件触发的对象 `document` 

## 节流

## 背景

适用于在一定时间内触发多次事件，只在达到特定时间间隔的时候才执行

## 原理

频繁触发事件的时候，在一定的时间内只执行一次,如果小于该时间间隔，不执行，大于该时间间隔的时候才执行

## 实现

```js
document.onmousemove = debounce(recordEvent,2000)

function recordEvent() {
    console.log('鼠标移动了');
}

/**
 * @param {*} fn
 * @param {*} time
 * @returns
 */
function debounce(fn,time) {
    var args;
    var previous = 0;//第一次默认时间是0
    return function(){
        var now = Date.now()// 获取当前时间戳
        args = arguments;
        if(now-previous>time){
            fn.call(this,args)
            previous = now// 将当前的时间戳赋值给previous，重新开始计算新的时间间隔
        }
    }
}
```
