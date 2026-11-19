---
description: "基本用法1. 发送请求fetch方法是全局的一个函数，在使用该函数进行请求时需要至少传一个参数url，其返回的是一个Promise对象：const request = fetch('https://api.apiopen.top/getJoke'); // 是一个promise2. 读取响应r..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/or75ez"
updated: "2021-01-17T05:03:41.000Z"
---

# JS专题之——Fetch

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/or75ez)

<details class="toc-details">
<summary>本页结构（17 个小节）</summary>

- 基本用法
- 1\. 发送请求
- 代码示例
- 2\. 读取响应response
- 复杂的请求
- 常见的请求
- Headers对象
- 1\. 创建
- 增删改
- Request对象

</details>

## 基本用法

### 1\. 发送请求

fetch方法是全局的一个函数，在使用该函数进行请求时需要至少传一个参数url，其返回的是一个Promise对象：

## 代码示例

```js
const request = fetch('https://api.apiopen.top/getJoke'); // 是一个promise
```

### 2\. 读取响应response

所以当请求的数据返回时，可以调用 `then` 方法，参数response是一个对象，重要的包含以下属性/方法：

1.  **text()**，返回一个Promise对象，当状态变成resolved时，提供接口返回内容的文本形式

```js
request.then((response)=>response.text())
			 .then(data=>{console.log(data)})//返回文本内容
```

2.  **json()**，和上面一样，只不过返回的是一个对象形式

```js
request.then((response)=>response.json())
			 .then(data=>{console.log(data)})//返回文本内容
```

3.  **ok**：返回一个布尔值，表示当前的请求成功还是失败；一般情况下，当状态码 `response.status`  是404，500时，fetch是不进行报错处理的（都走的是then方法），但如果要进行区分，可以使用 `ok` 属性进行判断就近是否真正完成了“成功”的请求：

```js
response.status//200
response.ok//true

response.status//404
response.ok//false

response.status//500
response.ok//false
```

4.  status：返回请求的状态码

## 复杂的请求

在项目中我们的请求可谓是五花八门，往往需要配置一些东西，这时候我们就需要传入第二个参数init对象，这时候请求模式就变成了

```js
fetch(url,obj)
```

具体的设置有：

-   `method`: 请求使用的方法，如 `GET、``POST。`
-   `headers`: 请求的头信息，形式为 [`Headers`](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers) 的对象或包含 [`ByteString`](https://developer.mozilla.org/zh-CN/docs/Web/API/ByteString) 值的对象字面量。
-   `body`: 请求的 body 信息：可能是一个 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)、[`BufferSource`](https://developer.mozilla.org/zh-CN/docs/Web/API/BufferSource)、[`FormData`](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)、[`URLSearchParams`](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams) 或者 [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/API/USVString) 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息，POST请求时该值通常是一个JSON字符串。
-   `mode`: 请求的模式，一般时cors，如 `cors、` `no-cors 或者` `same-origin。`
-   `credentials`: 请求的 credentials，如 `omit、``same-origin 或者` `include`。为了在当前域名内自动发送 cookie ， 必须提供这个选项， 从 Chrome 50 开始， 这个属性也可以接受 [`FederatedCredential`](https://developer.mozilla.org/zh-CN/docs/Web/API/FederatedCredential) 实例或是一个 [`PasswordCredential`](https://developer.mozilla.org/zh-CN/docs/Web/API/PasswordCredential) 实例。
-   `cache`:  请求的 cache 模式: `default`、 `no-store`、 `reload` 、 `no-cache` 、 `force-cache` 或者 `only-if-cached` 。
-   `redirect`: 可用的 redirect 模式: `follow` (自动重定向), `error` (如果产生重定向将自动终止并且抛出一个错误）, 或者 `manual` (手动处理重定向). 在Chrome中默认使用`follow（`Chrome 47之前的默认值是`manual`）。
-   `referrer`: 一个 [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/API/USVString) 可以是 `no-referrer、``client`或一个 URL。默认是 `client。`
-   `referrerPolicy`: 指定了HTTP头部referer字段的值。可能为以下值之一： `no-referrer、` `no-referrer-when-downgrade、` `origin、` `origin-when-cross-origin、` `unsafe-url 。`
-   `integrity`: 包括请求的  [subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) 值 （ 例如： `sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=）。`

### 常见的请求

1.  **发送JSON数据**

```js
const headers = new Headers({
  'Content-type': 'application/json',
});
const body = JSON.stringify({ page: 1 });
fetch('https://api.apiopen.top/getJoke', {
  method: 'POST',
  // 一般post亲求采用body参数
  body: body,
  // 请求头
  headers: headers,
});

```

2.  **发送FormData**

```js
const headers = new Headers({
  'Content-type': 'application/json',
});
const formData = new FormData();
formData.append(key,val)...
fetch('https://api.apiopen.top/getJoke', {
  method: 'POST',
  // 一般post亲求采用body参数
  body: formData,
  // 请求头
  headers: headers,
});

```

## Headers对象

在使用Fetch请求时，如果要设置请求头就要使用Header对象：

### 1\. 创建

```js
// 方式一,不传参，然后使用append添加参数
let headers = new Headers()
headers.append(key,val)//如headers.append('Content-type','application/json')

//方式2 传入一个对象
let headers = new Headers({
	"Content-type":"application/json"
})
```

### 增删改

```js
// 改
headers.set(key,val)
// 删
headers.delete(key)
//增加
headers.append(key,val)
```

## Request对象

顾名思义，这个对象暴露了请求的一些信息，也暴露了使用请求体的不同方式

### 1\. 创建Request对象

Request对象是一个构造函数，里面接收一个参数，一般是一个URL；也可以传入第二个参数——和Fetch一样的对象

```js
const request1 = new Request('https://api.apiopen.top/getJoke');
console.log(request1);

const request2 = new Request('https://api.apiopen.top/getJoke'，{
  method:"GET"
  // some prop
});
console.log(request2);
```

### 2\. 克隆Request对象

1.  **将一个request实例传给Request构造函数**

```js
let request1 = new Request()
let request2 = new Request(request1)
```

这种方式会得到request1的副本，但这种方式得到的req1和req2有时候并不完全一样，比如其req1的请求体会被标记为“已使用”

```js
const request1 = new Request('https://api.apiopen.top/getJoke', {
  body: 'fool',
  method: 'POST',
});
console.log(request1.bodyUsed); // true
// 克隆
const req2 = new Request(request1);
console.log(req2.bodyUsed); // false
```

2\. **使用clone()**

会创建一模一样的副本，没有任何值会被覆盖

```js
const request1 = new Request('https://api.apiopen.top/getJoke', {
  body: 'fool',
  method: 'POST',
});
console.log(request1.bodyUsed); // false
// 克隆
const req2 = request1.clone();
console.log(req2.bodyUsed); // false
```

### 3\. 在Fetch中使用Request对象

在使用fetch时，第一个参数传入已经创建好的Request实例，但此时如果传入第二个参数init对象，则会覆盖传入请求对象request的值：

```js
const request1 = new Request('https://api.apiopen.top/getJoke');
const fetch2 = fetch(request1); // get请求
const fetch3 = fetch(request1, {
  method: 'POST',
}); // post请求
```

但是直接传入request实例，会将请求体标记为已使用，也就意味着fetch调用只能调用一次，第二次调用就会报错，所以想要调用多次，**可以这样使用:**

```js
fetch(req1.clone())
fetch(req1.clone())
fetch(req1.clone())
...
// 调用几次都没问题
```

## Response对象

略

## 封装Fetch请求

```js
export default async(url = '', data = {}, type = 'GET', method = 'fetch') => {
    type = type.toUpperCase();
    url = baseUrl + url;

    if (type == 'GET') {
        let dataStr = ''; //数据拼接字符串
        Object.keys(data).forEach(key => {
            dataStr += key + '=' + data[key] + '&';
        })

        if (dataStr !== '') {
            dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
            url = url + '?' + dataStr;
        }
    }

    if (window.fetch && method == 'fetch') {
        let requestConfig = {
            credentials: 'include',//为了在当前域名内自动发送 cookie ， 必须提供这个选项
            method: type,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            mode: "cors",//请求的模式
            cache: "force-cache"
        }

        if (type == 'POST') {
            Object.defineProperty(requestConfig, 'body', {
                value: JSON.stringify(data)
            })
        }
        
        try {
            const response = await fetch(url, requestConfig);
            const responseJson = await response.json();
            return responseJson
        } catch (error) {
            throw new Error(error)
        }
    } else {
        return new Promise((resolve, reject) => {
            let requestObj;
            if (window.XMLHttpRequest) {
                requestObj = new XMLHttpRequest();
            } else {
                requestObj = new ActiveXObject;
            }

            let sendData = '';
            if (type == 'POST') {
                sendData = JSON.stringify(data);
            }

            requestObj.open(type, url, true);
            requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            requestObj.send(sendData);

            requestObj.onreadystatechange = () => {
                if (requestObj.readyState == 4) {
                    if (requestObj.status == 200) {
                        let obj = requestObj.response
                        if (typeof obj !== 'object') {
                            obj = JSON.parse(obj);
                        }
                        resolve(obj)
                    } else {
                        reject(requestObj)
                    }
                }
            }
        })
    }
}
```

## fetch和ajax 的主要区别

1、fetch()返回的promise将不会拒绝http的错误状态，即使响应是一个HTTP 404或者500，只有当请求超时，无网络链接，违反CORS时才会报错（执行catch方法）

2、在默认情况下 fetch不会接受或者发送cookies

3、使用了Promise来处理结果和回调

  

## 参考文章

1.  [Fetch](https://www.jianshu.com/p/7762515f8d1a)
