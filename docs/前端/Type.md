---
description: "相同点一、都可以描述一个函数或对象type// 都可以描述对象或者函数 type User = {     name: string;     age: number; }; const userArr1: User[] = [{ name: '张三', age: 16 }]; type sa..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/npspim"
updated: "2022-03-14T02:52:18.000Z"
---

# Type

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/npspim)

<details class="toc-details">
<summary>本页结构（13 个小节）</summary>

- 相同点
- 一、都可以描述一个函数或对象
- 代码示例
- 二、都允许扩展，但扩展方法不一样
- 2.1、type扩展type使用“&”
- 2.2、interface扩展interface使用“extends”
- 2.3、interface扩展type也使用“extends”
- 2.4、type扩展interface使用“&”
- 不同点
- 一、type 可以而 interface 不行

</details>

## 相同点

## 一、都可以描述一个函数或对象

**type**

## 代码示例

```ts
// 都可以描述对象或者函数
type User = {
    name: string;
    age: number;
};
const userArr1: User[] = [{ name: '张三', age: 16 }];
type sayUser = (name: string, age: number) => void;
const sayUserFunc: sayUser = (name, age) => {
    console.log(name, age);
};

```

**interface**

```ts
interface User {
    name: string;
    age: number;
}
interface sayUser {
    (name: string, age: number): void;
}
const userArr: User[] = [{ name: '张三', age: 19 }];
const sayUserFunc1: sayUser = (name, age) => {
    return name;
};
```

## 二、都允许扩展，但扩展方法不一样

### 2.1、type扩展type使用“&”

```ts
type Name = {
    name: string;
};

type User = Name & {
    age: number;
};
const user: User = {
    name: '李四',
    age: 8
};
```

### 2.2、interface扩展interface使用“extends”

```ts
interface Name {
    name: string;
}
interface User extends Name {
    age: number;
}

const user: User = {
    name: '李四',
    age: 8
};
```

### 2.3、interface扩展type也使用“extends”

```ts
type Name = {
    name: string;
};
interface User2 extends Name {
    age: string;
}
```

### 2.4、type扩展interface使用“&”

```ts
interface Name {
    name: string;
}

// interface扩展使用extends
type User2 = Name & {
    age: string;
};

```

## 不同点

## 一、type 可以而 interface 不行

type可以定义基础类型或者联合类型（相当于起别名）。

```ts
// type可以为基础类型定义别名，但实质仍然是number，只不过别名是Hello
type Hello = number;
// 可以定义联合类型
type Hello2 = number | string;
// 应用
const arr1: Hello2[] = ['马占山', 16];
interface Dog {
    (name: string): void;
}
interface Cat {
    (age: number): void;
}
type Animal4 = Dog | Cat;
```

## 二、interface可以而type不行

interface重复的声明能够合并。

```ts
interface House {
    area: number;
}
interface House {
    height: number;
}
// 应用
const house: House = {
    area: 180,
    height: 3
};

```

上面虽然声明了两个都为`House`的接口，但最终用的时候却是两个的合并。

对于type而言，就相当于重复声明，会报错的：

```ts
type Building = {
    floors: number;
};
// 标识符Building重复，因为type表示的就是类型别名，就相当于给类型起了个名字，名字重复当然不行啦
type Building = {
    height: number;
};
```

## 总结

总而言之，**type 关键字表示的是类型别名**，在实际编码的过程中，如果不清楚什么时候用interface/type，**能用 interface 实现，就用 interface , 如果不能就用 type** 。其他更多详情参看 [官方规范文档](https://link.juejin.cn/?target=https%3A%2F%2Fgithub.com%2FMicrosoft%2FTypeScript%2Fblob%2Fmaster%2Fdoc%2Fspec.md)。

## 参考文章

1.  [换个角度理解 Typescript 的 type 和 interface](https://zhuanlan.zhihu.com/p/351213183)
2.  [Typescript 中的 interface 和 type 到底有什么区别](https://juejin.cn/post/6844903749501059085)
