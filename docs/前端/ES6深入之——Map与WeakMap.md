---
description: "一、为什么是 Map ？1、 传统对象结构Map本质上是一个键值对的集合。和传统对象结构相比，传统的对象只能用字符串作为键名，这就在使用上造成了很大的限制了。这也是新增 Map 的原因之一。const data = {}; // element 为节点对象 const element = do..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/fr9glren3gccrgql"
updated: "2023-03-08T08:20:48.000Z"
---

# ES6深入之——Map与WeakMap

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/fr9glren3gccrgql)

<details class="toc-details">
<summary>本页结构（33 个小节）</summary>

- 一、为什么是 Map ？
- 1、 传统对象结构
- 代码示例
- 2、 Map 结构
- 3、Map特点
- 4、啥时候用Map
- 二、Map 实例属性和方法
- 1、 set
- 2、get
- 3、has

</details>

## 一、为什么是 Map ？

### 1、 传统对象结构

`Map`本质上是一个键值对的集合。和传统对象结构相比，传统的对象只能用**字符串作为键名**，这就在使用上造成了很大的限制了。这也是新增 `Map` 的原因之一。

## 代码示例

```js
const data = {};
// element 为节点对象
const element = document.querySelector(".node");
console.log(element); // 输出 div.node 对象
// 将对象转化成字符串输出 [object HTMLDivElement]
console.log(element.toString()); 
// 用点操作符不能有空格，所以采用中括号的形式给对象赋值
data[element] = 'objectData'
// 输出 objectData，说明在对象中存在[object HTMLDivElement]键名
console.log(data['[object HTMLDivElement]']);
```

在上面的代码中，我们创建了一个对象并将一个节点对象作为了它的键名，并进行了代码测试，首先验证了获取到的`element`节点为一个对象，再确定了经过`toString`方法转化后的结果，以这个值为键名成功的输出了`value`值`objectData`

![图片](/images/c2f6d264f4880e9f.webp)

也就是说：**传统对象的键名会通过**`**toString**`**方法转化为字符串类型**

### 2、 Map 结构

`**Map**`**类似于对象，但是键名不限于字符串**，可以说`Object`结构提供`键-值`对应，`Map`结构提供`值-值`对应因此其实采用`map`结构会优于传统对象；

```js
// 获取DOM
let el = document.querySelector('#container');
let map = new Map();
// 通过set方法给map设置指定键和对应的值
map.set(el,'哈喽');
// 通过get方法获取map中键所对应的值
console.log(map.get(el));
// Map结构
console.log(map);
```

打印结果

![image.png](/images/0801a4d368f57582.png)

### 3、Map特点

1.  **比较纯净**：Map 默认情况下不包含任何键，所有键都是自己添加进去的。不同于 Object 原型链上有一些默认的键。
2.  **键可以是任意类型：**Map 的键可以是**任意类型**数据，就连函数都可以。
3.  Map 的键值对个数可以**轻易**通过`size`属性获取，Object 需要手动计算。
4.  Map 在频繁增删键值对的场景下**性能**要比 Object 好。

### 4、啥时候用Map

1.  要添加的键值名和 Object 上的默认键值名冲突，又不想改名时，**用 Map**
2.  需要 String 和 Symbol 以外的数据类型做键值时，**用 Map**
3.  键值对很多，有需要计算数量时，**用 Map**
4.  需要频繁增删键值对时，**用 Map**

## 二、Map 实例属性和方法

### 1、 set

`set`方法设置键名`key`对应的键值为`value`，然后会返回整个`Map`结构，如果设置的`key`已经存在，则会更新`value`值，否则会新生成该键：

```js
    let map = new Map();
    // 通过set方法给map设置指定键和对应的值
    map.set('name','哈喽');
```

还可以链式调用

```js
map.set('name','张三').set('age',13)
```

### 2、get

通过`get`方法读取`key`对应的键值，如果传入的键值不存在，则会返回`undefined`

```js
let map = new Map();
map.set('name','张三').set('age',13)
console.log(map.get('name')); // 张三
console.log(map.get('sex'));// undefined
```

### 3、has

判断传入的键是否存在当前`Map`对象中，该方法返回一个布尔值

```js
    console.log(map.has('name')) // true
    console.log(map.has('sex')) // false
```

### 4、delete

删除某个键，如果删除成功返回true，否则返回false

```js
    console.log(map.delete('name')); // true
    console.log(map);
    console.log(map.delete('name')); // false
```

### 5、clear

清空map，没返回值

```js
map.clear();
console.log(map)
```

![image.png](/images/9ba22fad172d022b.png)

## 三、遍历方法

  

### 1、for...of

> `for...of`可以遍历有`iterator`接口的数据结构

```js
for (const iterator of map) {
  console.log(iterator); // 一个由键，值组成的数组
}
```

![image.png](/images/024e8f39c38e2ccc.png)

### 2、keys()

返回map键名组成的遍历器

```js
console.log(map.keys());
    for (const iterator of map.keys()) {
      console.log(iterator);
    }
```

![image.png](/images/d3498ce143e8ceee.png)

### 3、 values()

返回map键值迭代器

```js
 for (const iterator of map.values()) {
      console.log(iterator);
    }
```

![image.png](/images/3a40b012fd540a35.png)

### 4、entries

返回键值对的遍历器

```js
for (const iterator of map.entries()) {
      console.log(iterator);
    }
```

![image.png](/images/0c2154cdac0ebcb2.png)

### 5、forEach

```js
map.forEach((element,key) => {
      console.log(element,key);
    });
```

![image.png](/images/4169032664ff6625.png)

## 四. map类型转化

### 1、map转数组

解构

```js
let arr = [...map];
    console.log(arr);
```

返回的是键值二维数组

![image.png](/images/d8438837e491c550.png)

### 2、 数组转map

必须是二维数组,分别表示键值嘛

```js
 // 数组转map
    let map1 = new Map([[1,13],[2,18],[3,90]])
    console.log(map1);
```

![image.png](/images/b43b0150755401dd.png)

### 3、 map转对象

```js
let obj = {};
for (const [key,val] of map) {
  obj[key] = map
}
console.log(obj);
```

![image.png](/images/b758763b8326f643.png)

### 4、对象转map

```js
let obj1 = {
  name:'东方不败',
  sex:'未知',
  ability:'葵花宝典'
}

let map2 = new Map()
for (const key in obj1) {
  map2.set(key,obj1[key])
}
console.log(map2);
```

![image.png](/images/e8394783b3b4291e.png)

## 五、什么是WeakMap

`WeakMap`是 ES6 中新增的一种集合类型，叫做“弱映射”。它和`Map`是兄弟关系，与`Map`的区别就在于这个**弱字**，**API 还是**`**Map**`**的那套（只有**`**set** **get** **has** **delete**`**)**

那它真正是什么意思呢？

> 这其实描述的是 JS 中**垃圾回收**程序对待“弱映射”中键的方式

## 六、 WeakMap特点

### 1、 WeakMap 只能将对象作为键名, null除外

```js
    let weakmap = new WeakMap();
    weakmap.set(el,12);
    console.log(weakmap);
```

### 2、 WeakMap 的键名引用的对象是弱引用

什么是弱引用? 看下百度百科——

> 在计算机程序设计中，弱引用与强引用相对，**是指不能确保其引用的对象不会被垃圾回收器回收的引用**。 一个对象若只被弱引用所引用，则被认为是不可访问（或弱可访问）的，**并因此可能在任何时刻被回收**

**也就说弱引用可能随时被垃圾回收器回收！**

用一张图表示一下:

```js
const myMap = new WeakMap()
let my = {
    name: "ljc",
    sex: "男"
}
myMap.set(my, 'info');
console.log(myMap);
```

![图片](/images/0ec0bb273efc4d8b.webp)

**弱引用的引用计数为0**，一旦my解除对上述对象的引用，上述对象就会被回收

![图片](/images/9a44c432e8e49ea3.webp)

### 3、不可遍历

正因为`WeakMap`对键名所引用的对象是弱引用关系，因此`WeakMap`内部成员是会**取决于垃圾回收机制有没有执行**，运行前后成员个数很可能是不一样的，而垃圾回收机制的执行又是**不可预测**的，因此不可遍历。

## 七. WeakMap 的使用场景

### 1、 DOM 节点元数据

> 红宝书的例子

因为 `weakMap` 不会影响垃圾回收，所以可以用来关联元数据

![图片](/images/145ff2819cb6aade.webp)

当上面代码执行后，登录按钮从DOM树中被删除了，但由于 Map 对节点对象是强引用关系，仍然保存着对按钮的引用，所以会引起内存泄漏。

![图片](/images/4c6df86efe598159.webp)

 因此可以采用`WeakMap`当节点删除后，引用计数为0，等待垃圾回收机制回收

### 2、部署私有属性

利用弱映射，将内部属性设置为实例的弱引用对象，当实例删除时，私有属性也会随之消失，因此不会内存泄漏

阮一峰老师的代码实例：

![图片](/images/14f8078e7381b44f.webp)

### 3、数据缓存

当我们需要在不修改原有对象的情况下储存某些属性等，而又不想管理这些数据时，可以使用`WeakMap`

![图片](/images/9a864267c2f95f59.webp)

## 八、参考

1.  [浅析 Map 和 WeakMap 区别以及使用场景](https://zhuanlan.zhihu.com/p/429178150)
