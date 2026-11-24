---
description: "加载渲染过程：父beforeCreate-&gt;父created-&gt;父beforeMount-&gt;子beforeCreate-&gt;子created-&gt;子beforeMount-&gt;子mounted-&gt;父mounted该阶段其实这个大概的过程是可以理解的，毕竟只有父亲create后子才create嘛，同样..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/bmg4qg"
updated: "2021-03-13T13:29:45.000Z"
---

# Vue父子组件的钩子执行顺序

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/bmg4qg)

## 背景与思路

1.  加载渲染过程：父beforeCreate->父created->父beforeMount->子beforeCreate->子created->子beforeMount->子mounted->父mounted

> 该阶段其实这个大概的过程是可以理解的，毕竟只有父亲create后子才create嘛，同样的只有子挂载完毕，父亲才算挂载完毕嘛

2.  子组件更新过程：父beforeUpdate->子beforeUpdate->子updated->父updated
3.  父组件更新过程父：beforeUpdate->父updated
4.  销毁过程：父beforeDestroy->子beforeDestroy->子destroyed->父destroyed

> 这个更可以理解，自由子组件销毁后父组件才能销毁
