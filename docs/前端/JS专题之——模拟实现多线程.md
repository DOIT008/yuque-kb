---
description: "我们知道JS是单线程的，可是如果要实现js多线程怎么办呢，其实js给我们提供了一个API--Worker。构造函数Worker使用woker实例. ​onmessage​ 进行监听 ​postMessage​ 抛出来的事件当使用 ​new​ 创建 ​worker​ 实例的时候浏览器就会开启一个..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/cs2y6u"
updated: "2021-04-07T13:42:58.000Z"
---

# JS专题之——模拟实现多线程

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/cs2y6u)

我们知道JS是单线程的，可是如果要实现js多线程怎么办呢，其实js给我们提供了一个API--Worker。

## 构造函数Worker

1.  使用woker实例. `onmessage` 进行监听 `postMessage` 抛出来的事件
2.  当使用 `new` 创建 `worker` 实例的时候浏览器就会开启一个线程（暂且称为辅线程）来执行对应的js
3.  当辅线程的js使用 `postMessage` 抛出数据的时候就会被主线程的 `onmessage` 进行监听，从而进行通信

下面就举个例子:

### 主线程js

## 代码示例

```js
// 主线程js

// 创建一个worker，申请一个线程用来执行这个js文件(创建的时候就被执行),相对于根目录
let worker = new Worker('js/other.js');

// 当数据被抛出来的时候会执行onmessage事件，其实就像发布订阅者模式
worker.onmessage = function () {
  alert(12);
  console.log(event.data);
};

// 两秒后注销这个线程
setTimeout(() => {
  worker.terminate();
}, 2000);

// 重启线程
setTimeout(() => {
  worker = new Worker('js/other.js');
}, 3000);

```

### 辅线程other.js

```js
setTimeout(() => {
  this.postMessage('hahah');
}, 1000);
// console.log(this); 没有window对象

```

## 参考文章

1.  [HTML5之worker开启JS多线程模式及window.postMessage跨域](https://www.cnblogs.com/ZheOneAndOnly/p/11298750.html)
