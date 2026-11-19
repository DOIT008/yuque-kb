---
description: "Grunt、Gulp是基于任务运⾏的⼯具： 它们会⾃动执⾏指定的任务，就像流⽔线，把资源放上去然后通过不同插件进⾏加⼯，它们包含活跃的社区，丰富的插 件，能⽅便的打造各种⼯作流。 Webpack是基于模块化打包的⼯具: ⾃动化处理模块,webpack把⼀切当成模块，当 webpack 处理应⽤..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uwprf0"
updated: "2021-03-06T13:05:45.000Z"
---

# webpack与grunt、gulp

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uwprf0)

Grunt、Gulp是**基于任务运⾏**的⼯具：

它们会**⾃动执⾏指定的任务，就像流⽔线，把资源放上去然后通过不同插件进⾏加⼯**，它们包含活跃的社区，丰富的插 件，能⽅便的打造各种⼯作流。

Webpack是基于**模块化打包**的⼯具:

⾃动化处理模块**,webpack****把⼀切当成模块**，当 webpack 处理应⽤程序时，它会**递归地构建⼀个依赖关系图**

(dependency graph)，其中包含应⽤程序需要的每个模块，然后将所有这些模块打包成⼀个或多个 bundle。

因此这是完全不同的两类⼯具,⽽现在**主流的⽅式是⽤****npm script****代替****Grunt**、Gulp 、 `npm script` 同样可以打造任务流。

  

## 简而言之

webpack其实是**基于模块的**打包工具，在他的眼中万物届模块，他会分析各个模块的依赖并将其形成一个的chunk，女兵最后以bundle文件的形式进行展示出来

grunt它更像是一个流水线，是**基于任务的**，它会自动的执行相应的任务，你把资源放上去，他就会调用各个插件进行加工，当然其社区也很活跃。
