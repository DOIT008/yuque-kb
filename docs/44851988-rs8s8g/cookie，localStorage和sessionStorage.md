---
description: "基本概念cookie：由于HTTP协议是无状态的，而服务器端的业务必须是要有状态的。Cookie诞生的最初目的是为了存储web中的状态信息，以方便服务器端使用。比如判断用户是否是第一次访问网站（如果是第一次访问网站，在所有的http请求中都不会携带 Set-Cookie 的请求头，从服务器返回..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/tt997u"
updated: "2024-06-28T12:38:35.000Z"
---

# cookie，localStorage和sessionStorage

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/tt997u)

::: info 本页结构
- 
- 基本概念
- 三者区别
- 应用场景
- 参考文章：
:::

## 

![u=1677434373,3425086464&fm=15&gp=0.jpg](/images/fdbb7ec514007712.jpg)

## 基本概念

cookie：由于HTTP协议是无状态的，而服务器端的业务必须是要有状态的。Cookie诞生的最初目的是为了存储web中的状态信息，以方便服务器端使用。**比如判断用户是否是第一次访问网站（如果是第一次访问网站，在所有的http请求中都不会携带** `**Set-Cookie**` **的请求头，从服务器返回的响应中会携带** `**Set-Cookie**` **响应头，然后本地会保存这些cookie信息，在以后的请求中，在请求头中都会携带这些信息）**。

sessionStorage：会话，是可以将一部分数据在当前会话中保存下来，刷新页面数据依旧存在。但是页面关闭后，sessionStorage中的数据就会被清空。

localStorage：是HTML5标准中新加入的技术，当然早在IE6时代就有一个userData的东西用于本地存储，而当时考虑到浏览器的兼容性，更通用的方案是使用flash。如今localStorage被大多数浏览器所支持。

## 三者区别

**1）存储大小**

cookie：一般不超过4K（因为每次http请求都会携带cookie、所以cookie只适合保存很小的数据，如会话标识）

sessionStorage：5M或者更大

localStorage：5M或者更大

**2）数据有效期**

cookie：一般由服务器生成，可以设置失效时间；若没有设置时间，关闭浏览器cookie失效，若设置了时间，cookie就会存放在硬盘里，过期才失效

sessionStorage：仅在当前浏览器窗口关闭之前有效，关闭页面或者浏览器会被清除

localStorage：永久有效，窗口或者浏览器关闭也会一直保存，除非手动永久清除，因此用作持久数据

**3）作用域**

cookie：在所有同源窗口中都是共享的。

sessionStorage：在同一个浏览器窗口是共享的（不同浏览器、同一个页面也是不共享的）

localStorage：在所有同源窗口中都是共享的

**4）通信**

cookie：十种携带在同源的http请求中，即使不需要，故cookie在浏览器和服务器之间来回传递；如果使用cookie保存过多数据会造成性能问题

sessionStorage：仅在客户端（即浏览器）中保存，不参与和服务器的通信；不会自动把数据发送给服务器，仅在本地保存

localStorage：仅在客户端（即浏览器）中保存，不参与和服务器的通信；不会自动把数据发送给服务器，仅在本地保存

**5）易用性**

cookie：需要自己进行封装，原生的cookie接口不够友好

sessionStorage：原生接口可以接受，可以封装来对Object和Array有更好的支持

localStorage：原生接口可以接受，可以封装来对Object和Array有更好的支持

## 应用场景

cookie：判断用户是否登录过网站，以便实现下次自动登录或记住密码；保存事件信息等

sessionStorage：敏感账号一次性登录；单页面用的较多（sessionStorage 可以保证打开页面时 sessionStorage 的数据为空）

localStorage：常用于长期登录（判断用户是否已登录），适合长期保存在本地的数据

## 参考文章：

1.  [localstorage sessionstorage和cookie的区别](https://www.cnblogs.com/candy-xia/p/11561542.html)
2.  [好好了解一下Cookie(强烈推荐)](https://blog.csdn.net/zhangquan_zone/article/details/77627899)
