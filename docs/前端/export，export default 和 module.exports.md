---
description: "export，export default 和 module.export一、相同点三者都是要导出内容二、不同点export能使用多次// 声明 index.js export const name = '张三' export function add (){      }   // 使用，只..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/sqzqex"
updated: "2020-06-27T03:18:28.000Z"
---

# export，export default 和 module.exports

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/sqzqex)

## export，export default 和 module.export

  

### 一、相同点

  

三者都是要导出内容

  

### 二、不同点

  

`export`能使用多次

  

## 代码示例

```js
// 声明 index.js
export const name = '张三'
export function add (){
    
}

// 使用，只能import {} from '...'
import {name，add} from 'index.js'
```

  

`export default` 只能使用一次

  

```js
// 声明 index.js
const name = '张三'
function add (){
    
}
export default {
    name,
    add
}

// 使用，只能import {} from '...'
import sub from 'index.js'
// sub.name,sub.add()
```

  

`module.export`,一般是作为模块来使用的，通常用在工程话的项目中

  

```js
// index.js
module.exports = {
   name:"张三"，
    add(){
        //。。。
	}
}

// 使用
const module = require('index.js')
//module.name,module.add()
```
