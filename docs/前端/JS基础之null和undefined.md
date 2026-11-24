---
description: "相同点两者都是基础类型的数据，其值只有一个分别是 null 和 undefined 。如果将两者进行布尔化，都是 ​false​ 。在 非严格模式下两个相等。不同点undefined 一般来表示一个变量未被赋值，或者这个变量根本没定义。null 则表示一个变量是空对象，是有值的，只不过是空的罢..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/tasp7o"
updated: "2020-10-17T12:26:20.000Z"
---

# JS基础之null和undefined

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/tasp7o)

## 相同点

1.  两者都是基础类型的数据，其值只有一个分别是 `null` 和 `undefined` 。
2.  如果将两者进行布尔化，都是 `false` 。
3.  在 非严格模式下两个相等。

## 不同点

1.  `undefined` 一般来表示一个变量未被赋值，或者这个变量根本没定义。
2.  `null` 则表示一个变量是空对象，是有值的，只不过是空的罢了，再内存中表现就是一个在变量保存在栈中的地址在堆内存中没有对象，是个空指针。
3.  在使用 `typeof` 的时候， `undefined` 返回的是 `undefined` ，而 `null` 返回 `object` 。这很正常，毕竟 `null` 本身就是一个空对象，但空对象依然是对象呀！
