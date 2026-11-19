---
description: "什么是V8？一款高性能的JavaScript引擎，能够解析并执行js代码。V8的结构Ignition（基线编译器）TurboFan（优化编译器）Orinoco（垃圾回收器）Liftoff（WebAssembly 基线编译器）V8的执行管道我们知道无论什么代码都是需要CPU执行的，而对于CPU而..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uswy5q"
updated: "2021-02-25T15:08:20.000Z"
---

# V8引擎是如何执行JS代码的

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/uswy5q)

## 什么是V8？

一款高性能的JavaScript引擎，能够解析并执行js代码。

## V8的结构

-   Ignition（基线编译器）
-   TurboFan（优化编译器）
-   Orinoco（垃圾回收器）
-   Liftoff（WebAssembly 基线编译器）

## V8的执行管道

我们知道无论什么代码都是需要CPU执行的，而对于CPU而言，其能理解和运行的只有机器码（就是二进制的字节），所以对于像javaScript这种高级代码肯定要先将其转为CPU能识别的码的，其实这个过程我们也可以称之为**编译。**然后才是**执行**

下面的这幅图表示的就是V8引擎的编译过程：

![aHR0cDovL2ltYWdlLnRob3Jud3UuY29tLzIwMTkxMTA3MDkzNzMzLnBuZw.png](https://cdn.nlark.com/yuque/0/2021/png/1528528/1614263436329-1ed62372-d79e-47f3-a090-29b40bf66a3a.png)

> **为啥上面还有反优化？**
> 
> JavaScript 是一种非常灵活的动态语言，对象的结构和属性是可以在运行时任意修改的，**而经过优化编译器 优化过的代码只能针对某种固定的结构，一旦在执行过程中，对象的结构被动态修改了，那么优化之后的代码势必会变成无效的代码**，这时候优化编译器就需要执行 反优化操作，经过反优化的代码，下次执行时就会回退到解释器解释执行。

## V8引擎具体的执行过程

![20200331163541447.jpg](https://cdn.nlark.com/yuque/0/2021/jpeg/1528528/1614265528969-a8c8d4a8-f03a-4de4-8bb8-cf90231007dc.jpeg)

> **热点代码**
> 
> 在解释执行字节码的过程中，如果发现了某一段代码会被重复多次执行，那么监控器会将这段代码标记为 **热点代****码**。当某段代码被标记为热点代码后，V8 就会将这段字节码丢给 **优化编译器**，**优化编译器会在后台将字节码编译成二进制代码**，然后再对编译后的二进制代码执行优化操作，优化后的二进制机器代码的执行效率会得到大幅提升。**如果下面再执行到这段代码时，那么 V8 会优先选择优化之后的二进制代码，这样代码的执行速度就会大幅提升。**

## 参考

1.  [V8 是怎么跑起来的 —— V8 的 JavaScript 执行管道](https://blog.csdn.net/weixin_42940885/article/details/103629490)
2.  [V8是如何执行JavaScript代码的](https://blog.csdn.net/wyhstars/article/details/105226117)
