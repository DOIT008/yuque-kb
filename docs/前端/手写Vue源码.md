---
description: "Vue的设计思想Vue是一个MVVM的的前端框架，其实就是VM层，其并不关心View层和Model层本身是什么，Vue的相当于一个中间层让其当Model层发生改变的时候让View层进行更新，当View层发生改变的时候驱动数据Model更新。也就是说MVVM的三要素：数据响应式，模板引擎和渲染一..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/mn5xvl"
updated: "2020-06-13T15:13:31.000Z"
---

# 手写Vue源码

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/mn5xvl)

## Vue的设计思想

  

Vue是一个MVVM的的前端框架，其实就是`VM`层，其并不关心`View`层和`Model`层本身是什么，Vue的相当于一个中间层让其当`Model`层发生改变的时候让`View`层进行更新，当`View`层发生改变的时候驱动数据`Model`更新。

  

也就是说MVVM的三要素：**数据响应式，模板引擎和渲染**

  

## 一、Vue响应式的原理

  

Vue2.x实现响应式的原理是通过`Object.defineProperty()`来实现的，通过递归遍历数据对象的每一个属性，利用属性的`get`钩子函数和`set`（当数据发生跟新的时候执行）钩子函数，来实现数据的响应式。

  

## 代码示例

```js
function defineReactive(obj,key,val) {
    recurDataObj(val)
    Object.defineProperty(obj,key,{
        get(){
            // 读的拦截
            return val
        },
        set(newVal){
            // 如果val是对象，则重新监控，防止对某个值重新赋值是一个新的对象
            recurDataObj(newVal)
            console.log(key,val);
            
            // 当数据发生变化的时候会执行set函树
            if (val!==newVal) {
                val = newVal
                console.log(key,val);
            }
        }
    })    
}

// 递归数据对象上的所有数据，使某个数据都有一个get和se函数

function recurDataObj(dataObj) {
    if (typeof dataObj !<mark> 'object'|| dataObj </mark> null ) {
        return
    } 
    // 遍历对象上的所有数据
    Object.keys(dataObj).forEach(key=>{
        // 首先判断传入的是否是对象，或者是不能遍历的对象
        defineReactive(dataObj,key,dataObj[key])
    })
}
```

  

> Vue3.0 使用的是Proxy
