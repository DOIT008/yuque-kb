---
description: "一个面试题同时进行多个请求，如果其中一个报错了抛出异常，中断请求该如何做？如果不中断其他请求该如何做Promise.allPromise.all() 它接收一个promise对象组成的数组作为参数，并返回一个新的promise对象。当数组中所有的对象都resolve时，新对象状态变为fulfi..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ua8m4gv3be3fp0c5"
updated: "2024-08-04T12:15:57.000Z"
---

# JS深入之异步异常处理

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ua8m4gv3be3fp0c5)

## 一个面试题

> 同时进行多个请求，如果其中一个报错了抛出异常，中断请求该如何做？
> 
> 如果不中断其他请求该如何做

## Promise.all

-   `Promise.all()` 它接收一个`promise`对象组成的数组作为参数，并返回一个**新的**`**promise**`**对象。**
-   当数组中**所有的对象都**`**resolve**`**时**，**新对象状态变为**`**fulfilled**`，所有对象的`resolve`的`value`依次添加组成一个新的数组，并以新的数组作为新对象`resolve`的`value`。
-   **当数组中有一个对象**`**reject**`**时，新对象状态变为**`**rejected**`，并以当前对象`reject`的`reason`作为新对象`reject`的`reason`。

## axios.all

跟`Promise.all`用法类似

## 代码示例

```js
const axios = require('axios');

const request1 = axios.get('https://api.example.com/resource1');
const request2 = axios.get('https://api.example.com/resource2');

axios.all([request1, request2])
  .then(axios.spread((response1, response2) => {
    // 在这里处理 response1 和 response2
  }))
  .catch((error) => {
    // 处理错误
  });
```
