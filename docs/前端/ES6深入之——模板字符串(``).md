---
description: "其实模板字符串和普通的字符串差不多，只不过相对而言比较方便，尤其是在进行字符串拼接的时候更是如此，但差不多还是有区别的，比较典型的表现在以下方面：在模板字符串中可以使用变量，但普通字符串则不行// 模板字符串 let  count = 12; let temStr8 = `这里有${count..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/bkyfw5"
updated: "2020-10-03T13:00:02.000Z"
---

# ES6深入之——模板字符串(``)

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/bkyfw5)

## 背景与思路

其实模板字符串和普通的字符串差不多，只不过相对而言比较方便，尤其是在进行字符串拼接的时候更是如此，但差不多还是有区别的，比较典型的表现在以下方面：

-   **在模板字符串中可以使用变量，但普通字符串则不行**

## 代码示例

```js
// 模板字符串
let  count = 12;
let temStr8 = `这里有${count}个苹果`  
// 普通字符串
let  count = 12;
let temStr8 = "这里有"+count+"个苹果"  
```

-   **模板字符串中的空格，缩进以及换行都会被保留，但是普通的字符串不会**

```js
// 字符串中的空格，换行和缩进都会被保留
let temStr2 = `
        <ul>
            <li>12</li>
            <li>23</li>
        </ul>
`

console.log(temStr2,temStr2.length);// 76
let temStr3 = "        <ul><li>12</li>li>23</li></ul>"  ;
console.log(temStr3,temStr3.length);//38
```

-   模板标签是一个非常重要的能力，模板字符串可以紧跟在一个函数名后面，该函数将被调用来处理这个模板字符串，举个例子：

```js
// 标签模板
let x = `hi`;
let y = `hello`;
let z = `Kevin`;
var res = message`  ${x}${y},i am ${z}   `;
console.log(res,res.length);//  hihello,i am Kevin    

// 方法1
function message(literals,...values) {
    let result  = ''
    for (let index = 0; index < values.length; index++) {
        const element = values[index];
        const literal = literals[index]
        result+=literal;
        result+=element;
    }
    result += literals[literals.length-1]
    return result 
}
// 方法2，使用reduce
function message1(literals,...values) {
    let result = literals.reduce((pre,val,index)=>{
        console.log(index,pre,val);
        let value = values[index-1];// index从1开始地
        return pre+value+val
    })
    return result
}

let result1 = message1`  ${x}${y},i am ${z}   `
console.log(result1);//  hihello,i am Kevin    
```
