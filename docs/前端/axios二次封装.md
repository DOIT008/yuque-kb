---
description: "直接上代码import axios from 'axios';  const request = axios.create({   baseUrl:'/api',//在真正请求的时候会加载请求url上   timeOut:3000 // 超时时间  })  // 请求拦截 axios.inte..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/gghaao"
updated: "2022-06-18T03:18:20.000Z"
---

# axios二次封装

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/gghaao)

## 背景与思路

直接上代码

## 代码示例

```js
import axios from 'axios';

const request = axios.create({
  baseUrl:'/api',//在真正请求的时候会加载请求url上
  timeOut:3000 // 超时时间 
})

// 请求拦截
axios.interceptors.request.use(config=>{
  // 设置token
  config.headers['token'] = token // 之前存储的token，localStorage.getItem('token')
  return config
},error=>{
  return Promise.reject(error)
})

// 响应拦截
axios.interceptors.response.use(response=>{
  // 对响应数据进行预处理
  
  let {status，message} = response.data;
  if(status!==200){
    Message.error('....')
  }
  return config
},error=>{
  return Promise.reject(error)
})

```
