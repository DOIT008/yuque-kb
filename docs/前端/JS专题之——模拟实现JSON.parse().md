---
description: "JSON.parse模拟实现有三种方式:使用 ​eval()​ ；使用递归逐个遍历；状态机后两种实现起来比较麻烦，暂且不用详细陈述，现在我们主要使用 ​eval​ 来模拟 ​JSON.parse()​ ——function JSONParse(strObj) {     return eval..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/tm2hpi"
updated: "2020-10-27T12:22:25.000Z"
---

# JS专题之——模拟实现JSON.parse()

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/tm2hpi)

JSON.parse模拟实现有三种方式:

1.  使用 `eval()` ；
2.  使用递归逐个遍历；
3.  状态机

后两种实现起来比较麻烦，暂且不用详细陈述，现在我们主要使用 `eval` 来模拟 `JSON.parse()` ——

## 代码示例

```js
function JSONParse(strObj) {
    return eval(`(${strObj})`)
}

var obj = {
    name:'张三',
    age:14,
    hobbies:['篮球','音乐']
}
console.log(JSONParse(JSON.stringify(obj)));
```

但是上面的实现方法不安全——如果 `strObj` 传的不是一个对象字符串，而是一串可执行的代码，就很容易造成**XSS 漏洞**。所以为了规避这个问题，我们可以参考Douglas Crockford 给我们做了示范：**对参数 json 做校验，只有真正符合 JSON 格式，才能调用 eval**，具体就是下面这几个正则匹配：

```js
function advanceParse(jsonStr) {
    var rx_one = /^[\],:{}\s]*$/;
    var rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g;
    var rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;
    var rx_four = /(?:^|:|,)(?:\s*\[)+/g;

    if (
        rx_one.test(
            jsonStr
                .replace(rx_two, "@")
                .replace(rx_three, "]")
                .replace(rx_four, "")
        )
    ) {
        var obj = eval("(" +jsonStr + ")");
        return obj
    }
}

console.log(advanceParse(JSON.stringify(obj)));
```

## 参考文章

1.  [JSON.parse 三种实现方式](https://juejin.im/entry/6844903568919527432)
