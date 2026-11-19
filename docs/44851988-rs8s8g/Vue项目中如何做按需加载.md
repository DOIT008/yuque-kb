---
description: "第三方UI如Element出品的babel-plugin-component和AntDesign出品的babel-plugin-import 安装以上插件后，在.babelrc配置中或babel-loader的参数中进行设置，即可实现组件按需加载了。自己的代码通过import(*)语句来控制加..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/agxilw"
updated: "2021-03-05T14:02:31.000Z"
---

# Vue项目中如何做按需加载

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/agxilw)

## 第三方UI

如Element出品的`[babel-plugin-component](https://link.zhihu.com/?target=https%3A//github.com/ElementUI/babel-plugin-component)`和AntDesign出品的`[babel-plugin-import](https://link.zhihu.com/?target=https%3A//github.com/ant-design/babel-plugin-import)` 安装以上插件后，在`.babelrc`配置中或`babel-loader`的参数中进行设置，即可实现组件按需加载了。

## 自己的代码

通过`import(*)`语句来控制加载时机，webpack内置了对于`import(*)`的解析，会将`import(*)`中引入的模块作为一个新的入口在生成一个chunk。 当代码执行到`import(*)`语句时，会去加载Chunk对应生成的文件。`import()`会返回一个Promise对象，所以为了让浏览器支持，需要事先注入`Promise polyfill`
