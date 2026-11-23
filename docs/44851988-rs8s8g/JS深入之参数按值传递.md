---
description: "我们知道，JS函数的参数是按值传递的，但怎么验证呢？对于基本类型的值，上面的一句话很好理解--​实际上传递的是值的副本。例如：// 基本的值 var NUM = 123; function changeNum(num){     num = 456 } changeNum(NUM) conso..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ped8v4"
updated: "2024-01-01T08:11:08.000Z"
---

# JS深入之参数按值传递

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ped8v4)

![timg.png](/images/1506d759cf8b3175.png)

我们知道，JS函数的参数是按值传递的，但怎么验证呢？

对于基本类型的值，上面的一句话很好理解--**实际上传递的是值的副本。**例如：

## 代码示例

```js
// 基本的值
var NUM = 123;
function changeNum(num){
    num = 456
}
changeNum(NUM)
console.log(NUM);//123
```

可见虽然在函数 `changeNum` 里改变了参数的值，但并影响到外面的值 `NUM` ，可见对于基本类型的值上面的结论是成立的。

那么，对于引用类型的参数呢？先看一个例子吧：

```js
// 对象
var obj = {
    name:'张三'
}

function changeObj(obj) {
    obj.name = '李四'
}

changeObj(obj)
console.log(obj.name); // 李四
```

上述代码 `changeObj` 改变了参数 `obj` 的 `name`  属性，之后我们打印 `obj.name` 的时候发现也跟着变化了，这说明**对于引用类型****的参数，实际上传递的是引用的副本（也就是说，参数和全局变量的指针指向同一个对象）。**

再看一个例子：

```js
var obj1 = {
    name:'王五'
}

function changeZhen(obj) {
    obj = {
        name:'海贼王'
    }
}

changeZhen(obj1)
console.log(obj1.name);//王五
```

上述代码，函数 `changeZhen`  内部改变了参数 `obj1` 的指针，指向了新的对象，所以原来的指针就断了（当然也就影响不了全局的变量 `obj1` ），所以打印 `obj1.name` 依然是 `王五` 

  

## 结论

对于基本类型，函数的参数是按值传递的，对于引用类型，传递的是引用的副本（毕竟对于引用类型而言，变量所保存的本来就是指向对应对象的指针）

