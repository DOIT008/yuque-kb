---
description: "一、核心概念modulemodule其实就是打包前我们写的文件，比如入口文件index.js就是一个module对于webpack而言，万物皆modulechunkchunk代码块，是在打包的过程中产生的一个产物，一个chunk可能由多个module组成（因为可能存在文件的相互依赖的关系）；说..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/cxqnv9"
updated: "2021-02-04T14:02:11.000Z"
---

# Webpack之moudule，chunk，bundle

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/cxqnv9)

## 一、核心概念

  

### module

  

module其实就是打包前我们写的文件，比如入口文件`index.js`就是一个`module`

对于webpack而言，万物皆module

### chunk

  

chunk代码块，是在打包的过程中产生的一个产物，**一个chunk可能由多个module组成**（因为可能存在文件的相互依赖的关系）；

> 说白了就是bundle文件中eval(...)中的代码

#### chunk分类

  

-   webpack配置中**入口文件entry**是chunk

-   入口文件以及它的依赖文件通过**动态加载\**import()/require.ensure()\**出来的模块**是chunk

-   通过**SplitChunks**抽取出的公有代码 也是chunk

  

### bundle

  

`bundle`就是打包后的输出文件可以在浏览器中直接运行，比如入口文件`index.js`打包后在`dist`目录生成了一个`main.js`，那么该文件就是bundle文件；

> 就是打包后生成的文件

**也就是说 若干个module文件打包后生成的文件是bundle文件，在这个每一个bundle文件中可能有多个chunk代码块，**

**

![未命名绘图.png](/images/f935af6de111a90c.png)

**

## 参考文章：

1.  [webpack 中那些最易混淆的 5 个知识点](https://juejin.im/post/5cede821f265da1bbd4b5630)
