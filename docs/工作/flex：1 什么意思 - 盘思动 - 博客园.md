---
description: "flex: 1 是 Flexbox 布局中的一个非常常用的属性，它用于 让一个元素在容器中占据剩余的空间。具体来说，flex: 1 是 flex-grow, flex-shrink, 和 flex-basis 的简写。解释 flex: 1 的含义：flex-grow:"
source: "https://www.yuque.com/alipayqxigqpgusn/nmkii5/qwq51girfgyt1u2l"
updated: "2026-02-05T03:10:33.000Z"
---

# flex：1 什么意思 - 盘思动 - 博客园

> 来源：语雀「工作」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/nmkii5/qwq51girfgyt1u2l)

<details class="toc-details">
<summary>本页结构（7 个小节）</summary>

- 解释 `flex: 1` 的含义：
- 举个例子：
- 示例代码：
- 解释：
- 效果：
- 其他用法：
- 总结：

</details>

`flex: 1` 是 Flexbox 布局中的一个非常常用的属性，它用于 **让一个元素在容器中占据剩余的空间**。具体来说，`flex: 1` 是 `flex-grow`, `flex-shrink`, 和 `flex-basis` 的简写。

## 解释 `flex: 1` 的含义：

-   `**flex-grow: 1**`：元素将会扩展以占据容器中剩余的空间。如果有多个元素设置了 `flex-grow: 1`，它们会均分剩余空间。
-   `**flex-shrink: 1**`：当容器空间不足时，元素会收缩。如果设置为 1，元素会按比例缩小。
-   `**flex-basis: 0**`：默认情况下，`flex-basis` 决定了元素的初始大小。`flex: 1` 将其设置为 `0`，意味着元素的大小会基于剩余空间进行计算，而不是基于其内容的自然宽度。

## 举个例子：

假设你有三个 `div`，并且希望中间的 `div` 填充容器中的剩余空间，你可以给它设置 `flex: 1`。

## 示例代码：

```html
<div class="container">
  <div class="left">左侧</div>
  <div class="center">居中内容</div>
  <div class="right">右侧</div>
</div>
```

 

```css
.container {
  display: flex;
  justify-content: space-between;  
  align-items: center;            
  height: 100px;
}

.center {
  flex: 1; 
  text-align: center; 
}

.left, .right {
  width: 100px; 
  background-color: lightgray;
}
```

## 解释：

-   `**.center**` **的** `**flex: 1**`：中间的 `div` 会占据容器中 **剩余的空间**，确保它扩展以填充两侧的空隙。
-   `**.left**` **和** `**.right**`：这些 `div` 的宽度是固定的（100px），它们不会改变大小。
-   `**justify-content: space-between**`：左右两个 `div` 会自动分布到容器的两端。

## 效果：

-   `**left**` **和** `**right**` **会保持固定宽度**，而 `**center**` **会填充剩余空间**，并且内容在其中居中。

## 其他用法：

-   `**flex: 0**`：元素不会扩展，也不会收缩，保持它的初始大小。
-   `**flex: 2**`：如果一个元素的 `flex` 设置为 `2`，而其他元素的 `flex` 为 `1`，那么该元素会占据剩余空间的 **两倍**。

## 总结：

`flex: 1` 让元素在 **flex容器** 中占据剩余的空间，并且使该元素能够根据容器大小的变化进行自动扩展或收缩。

同样的，如果给所有元素设置 `flex:1`，那么所有元素将平分父级空间

​  

> 来自: [flex：1 什么意思 - 盘思动 - 博客园](https://www.cnblogs.com/pansidong/p/19188021)

​  

​
