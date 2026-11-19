---
description: "Export和Export default的区别export 本质上就是规定模块[js文件]的对外接口[属性或方法] export default 则是在 export 的基础上，为规定模块提供一个默认的对外接口 export可以导出多次，并且在引入的时候要使用import {} form '..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/vgxh1m"
updated: "2020-06-14T01:56:39.000Z"
---

# Export

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/vgxh1m)

## Export和Export default的区别

  

> `export` 本质上就是规定模块\[js文件\]的对外接口\[属性或方法\]  
> `export default` 则是在 `export` 的基础上，为规定模块提供一个默认的对外接口

  

1.  `export`可以导出多次，并且在引入的时候要使用`import {} form ''`,一般要先定义再导出 

## 代码示例

```js
// index.js
function add() {
  return 10000;
};
const a = 123;
const str = "hello world";
export {
 a,
 add,
 str
} ;
```

 

```js
// main.js
import { a, str, add } from "./index.js";//引入，必须要用大括号
console.log(a, str, add());//123 "hello world" 1000
```

  
    其实`index.js`也可以这么写，但引入方式是一样的 

```js
export const a = 123;
export const str = "hello world";
export function add() {
  return 10000;
}
```

2.  `export default` 在同一个模块（文件）中只能出现一次,一般导出的是一个对象，可以直接导出。  
    引入的时候一般使用`import name from '...'`  
    同样的功能： 

```js
// index.js
const a = 123;
const str = "hello world";
function add() {
  return 1000;
}
export default {
  a,
  str,
  add
```

  

};

  

```text

\`\`\`javascript
// main.js
import obj from "./index.js";
// 或者使用对象的解构
import { a, str, add } from "./index.js";
console.log(obj.a, obj.str, obj.add()); //123 "hello world" 1000
```

  

## module.exports

  

`module.exports`导出的内容一般是一个对象，在引入的时候是作为一个模块引入的，使用`require`引入，例如

  

```js
// a.js
module.exports = {
   // some code
}
```

  

在`b.js`中引入时使用`require`

  

```js
const a = require('a的路径')
```
