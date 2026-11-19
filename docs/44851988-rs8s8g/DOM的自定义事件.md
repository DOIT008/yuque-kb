---
description: "在使用Vue进行项目开发的时候，我们经常使用emit来触发一些自定义事件，总感觉很神奇，总想弄清楚自定义事件是如何实现的，结果还是在《JavaScript高级程序设计》找到了答案。三个步骤实际上，一个完整的自定义事件有三个步骤，分别是：创建事件对象： ​var event = new Even..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/hm96ux"
updated: "2020-08-23T04:14:37.000Z"
---

# DOM的自定义事件

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/hm96ux)

![timg.jpg](/images/20418beac0facf01.jpg)

在使用Vue进行项目开发的时候，我们经常使用emit来触发一些自定义事件，总感觉很神奇，总想弄清楚自定义事件是如何实现的，结果还是在《JavaScript高级程序设计》找到了答案。

## 三个步骤

实际上，一个完整的自定义事件有三个步骤，分别是：

1.  创建事件对象： `var event = new Event(事件名)` 
2.  在DOM上进行监听事件： `DOM.addEventListener(事件名，callback，boolean)` ，和window中自带的参数一样，表现也一样。
3.  触发事件： `DOM.dispatchEvent(event)` ，这一步一定是在某个合适的时机触发的，执行完这行代码后就会执行第二步中的 `callback` 

## 举个例子

## 代码示例

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <button id="btn"  >测试事件</button>
    <!-- <script src="js/13.js"></script> -->
    <script>
        window.onload = function(){
            var element = document.querySelector('#btn');
            // 创建事件对象
            var event = new Event('build');
            // 某个ODM进行监听
            element.addEventListener('build',()=>{
                alert(123)
            },false)
            // 触发事件
            element.dispatchEvent(event)
        }
    </script>
</body>
</html>
```

上述的自定义事件在加载页面的时候就会触发，因为是在 `window.onload` 中就触发了事件，实际上在项目中常常是在某个合适的时机进行触发的。
