---
description: "编写LoaderLoader像⼀个\"翻译官\"把读到的源⽂件内容转义成新的⽂件内容，并且每个Loader通过链式操作，将源⽂件⼀步步翻译成想要的样⼦。 编写Loader时要遵循单⼀原则，每个Loader只做⼀种\"转义\"⼯作。 每个Loader的拿到的是源⽂件内容，也可能是其他loader翻译后的..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/lt3v3h"
updated: "2021-02-23T23:35:16.000Z"
---

# 编写loader或plugin的思路

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/lt3v3h)

## 编写Loader

Loader像⼀个"翻译官"把读到的源⽂件内容转义成新的⽂件内容，并且每个Loader通过链式操作，将源⽂件⼀步步翻译成想要的样⼦。

编写Loader时要**遵循单⼀原则，每个****Loader****只做⼀种****"****转义****"****⼯作**。 每个Loader的拿到的是**源⽂件内容**，也可能是其他loader翻译后的结果（ source ），可以通过返回值的⽅式将**处理后的内容输出**，也可以调⽤ this.callback() ⽅法，将内容返回给webpack。 还可以通过 this.async() ⽣成⼀个 callback 函数，再⽤这个callback将处理后的内容输出出去。 此外 webpack 还为开发者准备了开发loader的⼯具函数集—— loader-utils 。

## 编写Plugin

相对于Loader⽽⾔，Plugin的编写就灵活了许多。 **webpack****在运⾏的⽣命周期中会⼴播出许多事件**，Plugin 可以**监听这些事件**，在合适的时机通过 Webpack 提供的 API 改变输出结果。
