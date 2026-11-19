---
description: "简单流程1. 转码: 浏览器将接收到的⼆进制数据按照指定编码格式转化为HTML字符串 2. ⽣成Tokens: 之后开始parser，浏览器会将HTML字符串解析成Tokens 3. 构建Nodes: 对Node添加特定的属性，通过指针确定 Node 的⽗、⼦、兄弟关系和所属 treeScop..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ngz25c"
updated: "2023-04-11T01:06:47.000Z"
---

# DOM树是如何构建的

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ngz25c)

## 简单流程

1\. 转码: 浏览器将接收到的⼆进制数据按照指定编码格式转化为HTML字符串

2\. ⽣成Tokens: 之后开始parser，浏览器会将HTML字符串解析成Tokens

3\. 构建Nodes: 对Node添加特定的属性，通过指针确定 Node 的⽗、⼦、兄弟关系和所属 treeScope

4\. ⽣成DOM Tree: 通过node包含的指针确定的关系构建出DOM Tree

## 示意图

![2021-02-21_221115.png](/images/d545ea5e89df40f6.png)
