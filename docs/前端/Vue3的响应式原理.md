---
description: "我们知道Vue3的响应式主要是通过Proxy（会拦截数据的操作，包括读取，删除，修改等）将原始的数据对象转化为代理对象，再通过Reflect实现相应的操作，相关知识可以参考这篇文章：         "
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/kcy1q1"
updated: "2022-12-28T13:43:58.000Z"
---

# Vue3的响应式原理

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/kcy1q1)

## 背景与思路

我们知道Vue3的响应式主要是通过`Proxy`（会拦截数据的操作，包括读取，删除，修改等）将原始的数据对象转化为代理对象，再通过`Reflect`实现相应的操作，相关知识可以参考[这篇文章](https://www.runoob.com/w3cnote/es6-reflect-proxy.html)：

## 代码示例

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script>
      // 原始数据
      const user = {
        name: "谢大脚",
        age: 27,
        husband: {
          name: "刘能",
          age: 30,
        },
      };

      const proUser = new Proxy(user, {
        // 访问数据
        get(target, prop) {
          console.log("获取数据中...");
          return Reflect.get(target, prop);
        },
        // 修改数据
        set(target, prop, value) {
          console.log("设置属性中...");
          Reflect.set(target, prop, value);
        },
        // 删除数据
        deleteProperty(target, prop) {
          console.log("删除数据中...");
          return Reflect.deleteProperty(target, prop);
        },
      });
      console.log(proUser.name); // 会触发get钩子，因为是访问数据嘛，user对象，name
      proUser.gender = "女"; // 因为是设置新的属性，所以会触发set钩子，
      console.log(proUser); // Proxy{name: '谢大脚', age: 27, husband: {…}, gender: '女'}
      delete proUser.gender;
      console.log(proUser); // Proxy {name: '谢大脚', age: 27, husband: {…}}

      // 深度访问和删除同样会触发上述钩子
      console.log("=========================");
      console.log(proUser.husband);
      proUser.husband.name = "尼古拉斯赵四";
      delete proUser.husband.age;
      console.log(proUser);
    </script>
  </body>
</html>

```
