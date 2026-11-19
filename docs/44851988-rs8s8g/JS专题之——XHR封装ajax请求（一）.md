---
description: "在实际的项目中我们经常会使用ajax进行数据的请求，但总是不知道其中的原理是什么，下面就让我们实际操作一下，一步步实现一个ajax请求。五个阶段一、创建XHR对象为了兼容期间，我们一般要进行兼容性处理，对于非IE浏览器可以使用 new XMLHttpRequest()  ,对于IE浏览器，可以..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/dgfh6z"
updated: "2021-01-16T08:05:09.000Z"
---

# JS专题之——XHR封装ajax请求（一）

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/dgfh6z)

::: info 本页结构
- 五个阶段
- 一、创建XHR对象
- 代码示例
- 二、创建ajax请求
- 三、发送ajax请求
- 四、设置请求头
- 五、接收相应
- 六、其他
- 一个get请求完整的例子
- 参考文章：
:::

在实际的项目中我们经常会使用ajax进行数据的请求，但总是不知道其中的原理是什么，下面就让我们实际操作一下，一步步实现一个ajax请求。

## 五个阶段

### 一、创建XHR对象

为了兼容期间，我们一般要进行兼容性处理，对于非IE浏览器可以使用 `new XMLHttpRequest()`  ,对于IE浏览器，可以使用 `new ActiveXObjet()` ,所以最终的代码就是  

## 代码示例

```js

var xhr = null;
if(window.XMLHttpRequest){
    xhr = new XMLHttpRequest();
} else{
    xhr = new ActiveXObject("Mricosoft.XMLHTTP");

```

### 二、创建ajax请求

创建ajax请求的方法是使用xhr对象的 `open` 方法，它接受 3 个参数：要发送的请求的类型（"get"、"post"等）、请求的 URL 和表示是否异步发送请求的布尔值。例如：

```js
// get请求
xhr.open('get','https://api.apiopen.top/getJoke?page=1&count=100&type=video',boolean);
//post请求
xhr.open('post','https://api.apiopen.top/getJoke',boolean);
```

最后一个参数如果是 `false` 表示是同步请求，如果是 `true` 表示发送异步请求，两者的区别是前者在服务器返回结果之前，不会执行剩下的其他代码，也就是说会阻碍代码的执行；但是后者不会阻碍剩下代码的执行。

不过一般而言我们发送的都是异步请求，这时第三个参数就是 `true` ,这个时候我们通常要使用 `xhr.onreadystatechange` 监听状态的变化：

```js
//当xhr.readyState属性发生变化的时候，触发该事件，所以要先监听，然后才是准备，发送，写在open和send之前
xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        console.log(JSON.parse(xhr.response));
      }
    }
  };
xhr.open('get', 'https://api.apiopen.top/getJoke' + formatParams(sendData), true);
xhr.send(null);
```

这一步主要是准备了一个请求，但是还没发送。

  

### 三、发送ajax请求

发送ajax请求使用xhr对象的send方法，里面可以传参数，如果没有参数可以传null，

对于get请求：

```js
xhr.send(null)
```

对于post请求

```js
xhr.send(params)
//这里的params是参数，是一个字符串，但是具体是什么样的字符串九不一定了，跟请求头有关；

```

### 四、设置请求头

xhr在get请求方式下， `content-type` 一般是不用设置的；因为 `get` 请求方式，只有一种传参方式： `?username=xxx&pass=xxx；` 后端服务器能明确的知道，接受到的数据是什么格式

但是对于 `post` 请求就不一样了，但是这字符串是什么格式的，可以有很多种。后端服务器需要浏览器（客户端），明确指出发送的是什么格式的字符串数据，以便服务器解析。因此就需要通过请求头设置 `content-type` ，用来告诉服务器，浏览器发送的参数是什么格式的字符串：

其一：

```js
// 必须在xhr.send()前设置 content-type: application/x-www-form-urlencoded

xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
// data必须是这种表单数据格式的字符串；否则服务器接受到数据，按照表单数据格式解析，实际发送的不是表单格式的数据，将会解析不出来
let data = 'username=xxx&pass=xxx';//也可以直接使用serialize(form表单对应的dom元素)
xhr.send(data);
```

#### FormData数据类型

现在我们经常的要对页面在中的表单数据进行序列化，所以XMLHttpRequest Level2 新增了新的类型 FormData以便于表单的序列化，然后通过post请求发送出去：

```js
// 第一种方法
 let data = new FormData();// 初始化一个formdata对象
data.append()//通过append来添加数据，两个参数分别是键和值，相当于表单字段名称和值
xhr.send(data)

// 第二种方法
 let data = new FormData(document.querySelector('form')) 直接将form的DOM元素传进去，
 xhr.send(data)
```

其二：

```js
3、// content-type: application/json; charset=UTF-8

let xhr = new XMLHttpRequest();
xhr.open('post', '/requestUrl');
// 必须在xhr.send()前设置
xhr.setRequestHeader('content-type', 'application/json; charset=UTF-8');
// data必须是JSON字符串格式的，否则服务器接受到数据，按照JSON字符串格式解析，实际发送的不是JSON字符串，将会解析不出来
let data = JSON.stringify({username: 'xxx', pass: 'xxx'});
xhr.send(data);
```

### 五、接收相应

我们知道一次请求会有很多中状态，我们主要关注 `xhr.status` 为4的时候(完成了请求，接收到响应)，每当状态发生改变的时候都会触发 `xhr` 对象的 `onreadystatechange` 事件，所以我们可以监听该事件：

```js
// 一般是写在open之后，send之前
xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            options.success(xhr.responseText);//xhr.responseText就是返回的数据，好像是一个字符串，可能需要转化一下
        }
}
```

### 六、其他

1.  设置超时：

```js
//一般写在send之前
// 设置超时时间，单位是ms
xhr.timeout = 1000;
// 如果1秒内没有返回，则触发该事件
xhr.ontimeout= function(){

}
```

## 一个get请求完整的例子

```js
// 格式化get参数
function formatParams(obj) {
  let str = '?';
  Object.keys(obj).forEach((key) => {
    str += `${key}=${obj[key]}&`;
  });
  return str.slice(0, str.length - 1);
}
//异步请求
function sendRequestAsync(sendData) {
  let xhr = new XMLHttpRequest();
  // 当xhr.readyState属性发生变化的时候，触发该事件，所以要先监听，然后才是准备，发送
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
        console.log(JSON.parse(xhr.response));
      }
    }
  };
  xhr.open('get', 'https://api.apiopen.top/getJoke' + formatParams(sendData), true);
  xhr.send(null);
  console.log('执行同步代码');
}
```

## 参考文章：

1.  [xhr中的content-type](https://www.jianshu.com/p/bcf8f26cbb4f)
2.  [Ajax及封装Ajax详解](https://blog.csdn.net/c__dreamer/article/details/80456565)
