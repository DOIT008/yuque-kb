---
description: "loaderwebpack默认只支持对 .js 文件和 .json 文件进行打包，但是一个项目不可能仅仅包括这两种文件，所以为了让webpack支持对其他文件的打包和解析，所以就需要Loader就是为了让webpack能够解析相应的文件比如css文件，html文件，vue文件等插件功能比loa..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/utp1zd"
updated: "2021-02-09T12:14:06.000Z"
---

# Webpack之loader和plugin

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/utp1zd)

::: tip 关于这篇短文
内容来自语雀原文，已保留核心信息。更多上下文可点击上方「查看原文」。
:::

## loader

webpack默认只支持对 `.js` 文件和 `.json` 文件进行打包，但是一个项目不可能仅仅包括这两种文件，所以为了让webpack支持对其他文件的打包和解析，所以就需要Loader

> 就是为了让webpack能够解析相应的文件比如css文件，html文件，vue文件等

## 插件

功能比loader要丰富，来帮助webpack实现各种功能的
