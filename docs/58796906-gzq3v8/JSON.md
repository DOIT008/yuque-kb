---
description: "一、定义JSON是一种轻量级的数据交互格式，通常用来存储数据的，Python语言使用JSON有很大优势，因为：JSON无非就是一个单独的字典（js中的对象）或一个内部元素都是字典的列表，所以JSON可以直接和Python的字典或列表进行无缝转换。二、JSON格式数据转化json.dumps（d..."
source: "https://www.yuque.com/alipayqxigqpgusn/gzq3v8/nhhoc03p0mq0dkgc"
updated: "2025-01-04T12:41:02.000Z"
---

# JSON

> 来源：语雀「Python」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/gzq3v8/nhhoc03p0mq0dkgc)

## 一、定义

JSON是一种轻量级的数据交互格式，**通常用来存储数据的**，Python语言使用JSON有很大优势，因为：JSON无非就是一个单独的字典（js中的对象）或一个内部元素都是字典的列表，所以JSON可以直接和Python的字典或列表进行无缝转换。

## 二、JSON格式数据转化

1.  `json.dumps（data）`：把python数据对象（列表或字典）转化为`json`格式的字符串，如果有中文可以带上：`ensure_ascii=False`参数来确保中文正常转换
2.  通过`json.loads（data）`方法把`json`格式字符串转化为python**列表或字典**

例如：

## 代码示例

```python
# 引入json模块
import json
# 创建一个包含两个字典的列表
person_list = [{"name": "John", "age": 25}, {"name": "Jane", "age": 30}]

# json.dumps()
person_json = json.dumps(person_list)
print(person_json,type(person_json)) # [{"name": "John", "age": 25}, {"name": "Jane", "age": 30}] <class 'str'>

# json.loads()
person_list = json.loads(person_json)
print(person_list,type(person_list)) # [{'name': 'John', 'age': 25}, {'name': 'Jane', 'age': 30}] <class 'list'>

dog = {"name": "哈士奇", "age": 3}
dog_json = json.dumps(dog,ensure_ascii=False)
print(dog_json,type(dog_json)) # {"name": "哈士奇", "age": 3} <class 'str'>
```
