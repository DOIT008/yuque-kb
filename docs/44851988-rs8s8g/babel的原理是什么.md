---
description: "babel 的转译过程也分为三个阶段，这三步具体是： 解析 Parse: 将代码解析⽣成抽象语法树( 即AST )，即词法分析与语法分析的过程 转换 Transform: 对于 AST 进⾏变换⼀系列的操作，babel 接受得到 AST 并通过 babel-traverse 对其进⾏遍历，在 ..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/kv7sv4"
updated: "2021-03-06T13:00:36.000Z"
---

# babel的原理是什么

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/kv7sv4)

babel 的转译过程也分为三个阶段，这三步具体是：

**解析** **Parse**: 将代码解析⽣成抽象语法树( 即AST )，即词法分析与语法分析的过程

**转换** **Transform**: 对于 AST 进⾏变换⼀系列的操作，babel 接受得到 AST 并通过 babel-traverse 对其进⾏遍历，在

此过程中进⾏添加、更新及移除等操作

**⽣成** **Generate**: 将变换后的 AST 再转换为 JS 代码, 使⽤到的模块是 babel-generator

如下图所示：

![2021-02-24_071423.png](https://cdn.nlark.com/yuque/0/2021/png/1528528/1614122077377-6e05ade9-32ca-4fc4-9179-af1dbe241053.png)

  

## 简而言之

将源代码---抽象语法树--转换---转换后的抽象语法树---新代码
