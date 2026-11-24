---
description: "一、什么是声明文件其实就是d.ts文件二、作用.d.ts 文件主要是 for 第三方库，让第三方库的使用者可以获得良好的代码和接口提示（因为并不是所有的三方库是用ts写的），通常前端开发者不需要我们亲自写这个声明文件（因为库的作者都写好了），具体的书写位置和方式根据你的具体需求而定。三、怎么声..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qv1se7"
updated: "2023-01-13T02:39:46.000Z"
---

# 声明文件（d.ts）

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/qv1se7)

<details class="toc-details">
<summary>本页结构（8 个小节）</summary>

- 一、什么是声明文件
- 二、作用
- 三、怎么声明
- 四、创建自己的类型声明文件
- 4.1、抽离出公共的类声明
- 代码示例
- 4.2、项目使用TS重构时
- 五、参考文章

</details>

## 一、什么是声明文件

其实就是`d.ts`文件

## 二、作用

**.d.ts 文件主要是 for 第三方库，让第三方库的使用者可以获得良好的代码和接口提示（因为并不是所有的三方库是用ts写的），**通常前端开发者不需要我们亲自写这个声明文件**（因为库的作者都写好了）**，具体的书写位置和方式根据你的具体需求而定。

## 三、怎么声明

1.  要使用关键字`declare`;
2.  在这个文件种我们**不负责具体的实现**，**主要是声明类型**；
3.  不会生成`.js`文件，仅仅用于提供类型信息；
4.  可能会在声明文件的头部用到三斜线指令（主要是用在声明文件的依赖上），具体用法可以参考[官网](https://www.tslang.cn/docs/handbook/triple-slash-directives.html)

## 四、创建自己的类型声明文件

### 4.1、抽离出公共的类声明

在实际的开发中，可能会有很多`.ts`文件使用同一种类型，当然你可以在每一个`.ts`文件中都重复声明该类型，但更推荐的方法是声明一个.d.ts文件进行专门的类型声明，然后在需要的地方使用`import`导入即可，例如：

## 代码示例

```ts
export interface Animal {
  name:string;
  class:string;
  weight:number;
  height:number;
  isEatMeat:boolean
}

export type AnyArr = number|string;
```

 

```ts
import { Animal,AnyArr } from "./03";// 不能写'./03.d.ts',否则会报错

let animal:Animal ={
  name:'小猫'
}
let arr:AnyArr[] = ['12',12]
```

当然如果其他文件需要使用该类型声明文件直接导入（`import`）即可。

### 4.2、项目使用TS重构时

**第一种情况：原来的项目时使用**`**.js**`**写的，那当迁移到**`**.ts**`**写的时候怎么为这些所谓的**`**.js**`**文件提供类型声明文件呢？或者在.ts文件中如果要引用某个js文件，怎么为这个js文件提供类型声明呢？**

说明：

1.  在导入`.js`文件时，**TS会自动加载与**`**.js**`**文件同名的**`**.d.ts**`**文件（在同一文件夹下），**以提供类型声明。
2.  **使用**`**declare**`**关键字**：用于类型声明，为其他地方（比如 `.js`文件）已存在的变量提供类型声明，而不是创建一个新的变量。

> 对于`interface`，`type`等这些明确就是TS类型的就不需要使用`declare`了，
> 
> 对于例如`let`，`var`，`const`，`function`等具有双重含义（在`.js`文件，`.ts`文件都能使用）应该使用`declare`关键字

一个完整的例子：

```ts
import {a,b,decrease} from './utils.js'
```

 

```js
let a = 10;
let b = false;
function decrease(x, y) {
  return x - y;
}
let obj = {
  name: "张三",
  age: 13,
  isMarried: false,
};

function print(val) {
  console.log(val);
}

const formatPosition = (obj) => {
  console.log(obj);
};

export {a,b,decrease,obj,print,formatPosition}
```

对应的声明文件`utils.d.ts`：

```ts
declare let a:number;
declare let b:boolean;
declare function decrease (x:number,y:number):number

interface Obj {
  name:string;
  age:number;
  isMarried:boolean
}
declare let obj:Obj

declare function print (val:string):void

type FormatPosition = (obj:Obj)=>void;
declare const formatPosition:FormatPosition;

// 类型提供好以后，需要使用模块化方案种提供的模块化语法来导出声明好的类型，然后才能在.ts文件种使用
export {a,b,obj,print,formatPosition,Obj}
```

**第二种情况：作为库的作者，为自己的库提供类型声明文件（比较少见，不再赘述，可以参考成熟的库看人家怎么写的）**

## 五、参考文章

1.  [typescript 声明文件加载机制以及在不同场景下的正确使用方式](https://zhuanlan.zhihu.com/p/133344957#:~:text=.d.ts%20%E6%96%87%E4%BB%B6%E6%98%AF%20typescript%20%E7%9A%84%E5%A3%B0%E6%98%8E%E6%96%87%E4%BB%B6%EF%BC%8C%E4%B8%BB%E8%A6%81%E7%94%A8%E6%9D%A5%E7%BB%99%E7%BC%96%E8%BE%91%E5%99%A8%E5%81%9A%E4%BB%A3%E7%A0%81%E6%8F%90%E7%A4%BA%E7%94%A8%EF%BC%8C%E5%85%B7%E4%BD%93%E7%9A%84%E4%B9%A6%E5%86%99%E4%BD%8D%E7%BD%AE%E5%92%8C%E6%96%B9%E5%BC%8F%E6%A0%B9%E6%8D%AE%E4%BD%A0%E7%9A%84%E5%85%B7%E4%BD%93%E9%9C%80%E6%B1%82%E8%80%8C%E5%AE%9A%E3%80%82,%EF%BC%88%E5%AB%8C%E5%BC%83%E5%A4%AA%E9%95%BF%E5%8F%AF%E4%BB%A5%E7%9B%B4%E6%8E%A5%E8%B7%B3%E5%88%B0%E4%BD%BF%E7%94%A8%E6%96%B9%E5%BC%8F%E7%9A%84%201.1%20%E5%92%8C%202.3%EF%BC%89)​
