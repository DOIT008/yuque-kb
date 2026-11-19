---
description: "你通过 window.open(新窗口) ， location.href ，带 _blank属性的a标签(新窗口) 进行跳转的时候，会把旧窗口的sessionStorage数据带过去，但是新旧窗口（tab页）的sessionStorage数据互不影响。但是如果你主动的打开新的窗口（tab页），..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/vdl3a7"
updated: "2021-03-13T13:20:31.000Z"
---

# sessionStorage的存储问题

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/vdl3a7)

::: tip 关于这篇短文
内容来自语雀原文，已保留核心信息。更多上下文可点击上方「查看原文」。
:::

## 背景与思路

1.  你通过 `window.open(新窗口)` ， `location.href` ，带 `_blank属性的a标签`(新窗口) 进行跳转的时候，会把旧窗口的sessionStorage数据带过去，但是新旧窗口（tab页）的sessionStorage数据互不影响。
2.  但是如果你主动的打开新的窗口（tab页），你会发现sessionStorage数据都不见了。

##
