---
description: "考察的是路由守卫分类全局守卫：beforeEach路由独享首尾：beforeEnter组件内守卫：beforeRouteEnter，beforeRouteUpdate，beforeRouteLeave三者区别全局守卫是只要路由发生改变，就会触发；路由守卫是只要到这个路由便触发；组件路由守卫是这..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uwyrim"
updated: "2021-02-01T13:23:42.000Z"
---

# 谈谈你对Vue路由安全的理解

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uwyrim)

考察的是路由守卫

## 分类

全局守卫：beforeEach

路由独享首尾：beforeEnter

组件内守卫：beforeRouteEnter，beforeRouteUpdate，beforeRouteLeave

  

## 三者区别

全局守卫是只要路由发生改变，就会触发；

路由守卫是只要到这个路由便触发；

组件路由守卫是这个组件专用的守卫，要知道这个组件可能被多次使用。

  

## 执行顺序

全局守卫——路由独享守卫——组件内守卫

## 后台的路由？

表示URL和要调用函数的关系，比如

Route是一条路由：

## 代码示例

```js

app.get('/', (req, res) => {
  res.sendFile('index')
}) // 当访问/的时候，会返回index页面
 
app.get('/users', (req, res) => {
  db.queryAllUsers().then(data => res.send(data))
}//当访问/users的时候，会从数据库中取出所有用户数据并返回

```

就是把路径与函数进行一一对应，通过路径信息调用特定的函数

`Router` 则负责管理 `route` 与函数之间的映射关系

## 路由守卫的原理?

开课吧
