---
description: "其实他们的出现代表着框架模式的不同阶段，目标都是解决Model层和View层的耦合问题。MVCMVC 模式出现较早主要应用在后端，如 Spring MVC、ASP.NET MVC 等，在前端领域的早期也有应用，如 Backbone.js。它的优点是分层清晰，缺点是数据流混乱，灵活性带来的维护性..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/iut5yk"
updated: "2024-07-10T13:35:56.000Z"
---

# 谈谈你对MVC，MVP，MVVM的理解

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/iut5yk)

<details class="toc-details">
<summary>本页结构（3 个小节）</summary>

- MVC
- MVP
- MVVM

</details>

其实他们的出现代表着框架模式的不同阶段，**目标都是解决Model层和View层的耦合问题。**

## MVC

**MVC 模式出现较早主要应用在后端**，如 Spring MVC、ASP.NET MVC 等，在前端领域的早期也有应用，如 Backbone.js。它的**优点是分层清晰，缺点是数据流混乱，灵活性带来的维护性问题**。

前端的 MVC 与后端类似，具备着 View、Controller 和 Model。

Model：负责保存应用数据，与后端数据进行同步。

Controller：负责业务逻辑，根据用户行为对 Model 数据进行修改。

View：负责视图展示，将 model 中的数据可视化出来。

其架构模式如下:

![mvc.png](/images/196179ca9b7379a9.png)

但是尝尝我们不这样开发，因为开发过程不灵活，比如一个小事件就必须要经过这个流程，所以我们在实际的开发中，会使用这种“改进”方案：

![2021-01-30_145456.png](/images/51bc7b365725c37a.png)

**代表作就是backbone.js**，但是这种方案也会引来另一个问题，那就是数据流混乱，很明显嘛，当试图改变就会导致Model层（数据）发生变化，同样的当Model层发生变化的时候就会导致View层发生变化，如果当试图层比较多的时候，就更麻烦了。

## MVP

MVP 模式在是 MVC 的进化形式，Presenter 作为中间层负责 MV 通信，解决了两者耦合问题，**但 P 层 过于臃肿会导致维护问题。**

为什么会过于臃肿？首先我们看一下这种模式的图解：

![2021-01-30_150313.png](/images/d321c120e0cedc2f.png)

因为Presenter作为中间层，既要和View层打交道，又要和Model层打交道，比如当数据发生变化的时候会通过操作DOM来更改数据，同样的当视图发生变化的时候就要通过事件来通知Model层来更改数据，那么Presenter层承担太多的功能，当一个应用比较复杂的时候不敢想象Presenter会有多么臃肿。

## MVVM

它不仅解决 MV 耦合问题，还同时解决了维护两者映射关系的大量繁杂代码和 DOM 操作代码，在提高开发效率、可读性同时还保持了优越的性能表现。

为什么？

看图解：

![2021-01-30_151001.png](/images/9e38c60f5d4ae6d5.png)

ViewModel 通过实现一套数据响应式机制**（diff算法和虚拟DOM）**自动响应 Model 中数据变化；

**通过事件监听响应 View 中用户交互修改 Model 中数据。**

这样在 ViewModel 中就减少了大量 DOM 操作代码，同时开发效率也会非常高。
