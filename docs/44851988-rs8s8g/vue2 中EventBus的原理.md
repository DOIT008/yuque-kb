---
description: "class EventBus{     constructor(){         this.event=Object.create(null);     };     //注册事件     on(name,fn){         if(!this.event[name]){       ..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/gthtwk3dvc7fgoeh"
updated: "2024-07-24T13:38:20.000Z"
---

# vue2 中EventBus的原理

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/gthtwk3dvc7fgoeh)

## 背景与思路

## 代码示例

```js
class EventBus{
    constructor(){
        this.event=Object.create(null);
    };
    //注册事件
    on(name,fn){
        if(!this.event[name]){
            //一个事件可能有多个监听者
            this.event[name]=[];
        };
        this.event[name].push(fn);
    };
    //触发事件
    emit(name,...args){
        //给回调函数传参
        this.event[name]&&this.event[name].forEach(fn => {
            fn(...args)
        });
    };
    //只被触发一次的事件
    once(name,fn){
        //在这里同时完成了对该事件的注册、对该事件的触发，并在最后取消该事件。
        const cb=(...args)=>{
            //触发
            fn(...args);
            //取消
            this.off(name,fn);
        };
        //监听
        this.on(name,cb);
    };
    //取消事件
    off(name,offcb){
        if(this.event[name]){
            let index=this.event[name].findIndex((fn)=>{
                return offcb===fn;
            })
            this.event[name].splice(index,1);
            if(!this.event[name].length){
                delete this.event[name];
            }
        }
    }
}
```

发布-订阅者模式
