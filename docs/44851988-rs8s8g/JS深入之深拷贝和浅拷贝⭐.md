---
description: "深拷贝、浅拷贝和赋值之间的关系深拷贝：从堆内存中开辟一个新的区域存放新对象，对对象中的子对象进行递归拷贝,拷贝前后的两个对象互不影响浅拷贝：重新在堆中创建内存，拷贝前后对象的基本数据类型互不影响，但拷贝前后对象的引用类型因共享同一块内存，会相互影响。赋值：不会再堆中创建新的内存，只是将原对象的..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ltr015"
updated: "2024-07-24T13:48:50.000Z"
---

# JS深入之深拷贝和浅拷贝⭐

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/ltr015)

::: info 本页结构
- 深拷贝、浅拷贝和赋值之间的关系
- 浅拷贝实现方式
- 一、Object.assign()
- 代码示例
- 二、使用展开运算符
- 三、数组的拷贝--Array.prototype.concat()
- 四、数组的拷贝--Array.prototype.slice()
- 深拷贝实现方式
- 一、JSON.parse(JSON.stringify())
- 缺陷
:::

## 深拷贝、浅拷贝和赋值之间的关系

**深拷贝**：从堆内存中开辟一个新的区域存放新对象，对对象中的子对象进行递归拷贝,拷贝前后的两个对象互不影响

**浅拷贝**：重新在堆中创建内存，拷贝前后对象的基本数据类型互不影响，但拷贝前后对象的引用类型因共享同一块内存，会相互影响。

**赋值**：不会再堆中创建新的内存，只是将原对象的内存传递给了另一个对象。

## 浅拷贝实现方式

## 一、Object.assign()

## 代码示例

```js
let obj = {
    a:12,
    b:'我是一个字符串',
    c:[1,2,3],
    d:{
        name:'张三'
    }
}

// 浅拷贝
let objCopy = Object.assign({},obj);
objCopy.c.push(4)// 改变c的内容
console.log(objCopy,obj.c);//[1,2,3,4]
```

## 二、使用展开运算符

```js
let obj2 = {
    a:12,
    b:'我是一个字符串',
    c:[1,2,3],
    d:{
        name:'张三'
    }
}

// 展开运算符
let objCopy1 = {...obj2}
objCopy1.c.push(5);
console.log(objCopy1,obj2);//[1,2,35]
```

## 三、数组的拷贝--Array.prototype.concat()

```js
let arr = [1,2,3,{name:'张三'}];
let arrCopy = arr.concat();
arrCopy[3].name = "李四";
console.log(arr,arrCopy);//[1,2,3{name:'李四'}]
```

## 四、数组的拷贝--Array.prototype.slice()

```js
let arr = [1,2,3,{name:'张三'}];
let arrCopy2 = arr.slice();
console.log(arrCopy2);
```

## 深拷贝实现方式

## 一、JSON.parse(JSON.stringify())

```js
let obj3 = {
    a:12,
    b:'我是一个字符串',
    c:[1,2,3],
    d:{
        name:'张三'
    }
}

let objDeepCopy = JSON.parse(JSON.stringify(obj3));
console.log(objDeepCopy);
```

### 缺陷

1.  如果obj里面有时间对象，则`JSON.stringify`后再`JSON.parse`的结果，**时间将只是字符串的形式**
2.  **如果obj里有RegExp、Error对象，则序列化的结果将只得到空对象；**
3.  如果obj里**有函数，undefined**，则序列化的结果会把**函数或 undefined丢失**；

  

  

## 二、手写使用递归

### 初版

```js

let obj4 = {
    a:12,
    b:'我是一个字符串',
    c:[1,2,3],
    d:{
        name:'张三',
        e:[4,5,6],
        f:{
            firstName:'李白'
        }
    }
}
// 使用递归
function recurObj(obj) {
    let obj2 = {};
    for (const key in obj) {
        if(Array.isArray(obj[key])){
            // 判断是否是数组
            let arr = [...obj[key]];
            obj2[key] = arr
        }else if(typeof obj[key]==='object'){
             // 如果是对象的话
            obj2[key] = recurObj(obj[key]);
        }else{
            // 基本值
            obj2[key] = obj[key]
        }
    }
    return obj2
}

let obj8 = recurObj(obj4);
obj8.c.push(90);
console.log(obj4.c.length,obj8.c.length);//3，4
```

### 完整版

递归方法实现深度克隆原理：**遍历对象、数组直到里边都是基本数据类型，然后再去复制，就是深度拷贝**。

有种特殊情况需注意就是对象存在**循环引用**的情况，即对象的属性直接的引用了自身的情况，解决循环引用问题，我们可以额外开辟一个存储空间，来存储当前对象和拷贝对象的对应关系，当需要拷贝当前对象时，先去存储空间中找，有没有拷贝过这个对象，如果有的话直接返回，如果没有的话继续拷贝，这样就巧妙化解的循环引用的问题。关于这块如有疑惑，请仔细阅读`ConardLi大佬`[如何写出一个惊艳面试官的深拷贝?](https://segmentfault.com/a/1190000020255831)这篇文章。

```js
function deepClone(obj, hash = new WeakMap()) {
  if (obj === null) return obj; // 如果是null或者undefined我就不进行拷贝操作
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  // 可能是对象或者普通的值  如果是函数的话是不需要深拷贝
  if (typeof obj !== "object") return obj;
  // 是对象的话就要进行深拷贝
  if (hash.get(obj)) return hash.get(obj);
  let cloneObj = new obj.constructor();
  // 找到的是所属类原型上的constructor,而原型上的 constructor指向的是当前类本身
  hash.set(obj, cloneObj);
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      // 实现一个递归拷贝
      cloneObj[key] = deepClone(obj[key], hash);
    }
  }
  return cloneObj;
}
let obj = { name: 1, address: { x: 100 } };
obj.o = obj; // 对象存在循环引用的情况
let d = deepClone(obj);
obj.address.x = 200;
console.log(d);

```

## 参考文章

1.  [深拷贝和浅拷贝](https://juejin.im/post/6844904197595332622#heading-13)
