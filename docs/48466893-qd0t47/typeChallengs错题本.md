---
description: "Easy1. 元组转化为对象将一个元组类型转换为对象类型，这个对象类型的键/值和元组中的元素对应。const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const  type result = TupleToObject"
source: "https://www.yuque.com/alipayqxigqpgusn/qd0t47/rivxlduuhptih7sg"
updated: "2024-03-13T09:42:11.000Z"
---

# typeChallengs错题本

> 来源：语雀「开源」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/qd0t47/rivxlduuhptih7sg)

<details class="toc-details">
<summary>本页结构（14 个小节）</summary>

- Easy
- 元组转化为对象
- 代码示例
- 获取元组的长度
- Awaited
- Parameters
- Medium
- 获取函数返回类型
- 实现Omit
- 对象部分属性已读

</details>

## Easy

### 元组转化为对象

将一个元组类型转换为对象类型，这个对象类型的键/值和元组中的元素对应。

## 代码示例

```ts
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type result = TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

#### 解析

解决这个问题的关键是怎么拿到数组里面的元素并组合成联合类型，注意`typeof tuple[number]`和`typeof tuple`的区别

```ts
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
type A = typeof tuple[number] // type A = "tesla" | "model 3" | "model X" | "model Y"

// 注意区分
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const
type A = typeof tuple // const tuple: readonly ["tesla", "model 3", "model X", "model Y"]
```

拿到了联合类型，剩下的就很容易了

```ts
type TupleToObject<T extends readonly any[]> = [
  [P in T[number]]:P;
]
```

### 获取元组的长度

创建一个Length泛型，这个泛型接受一个只读的元组，返回这个元组的长度。

```ts
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla> // expected 4
type spaceXLength = Length<spaceX> // expected 5
```

#### 解析

```ts
type Length<T> = T extends readonly any[] ? T['length'] : never
```

### Awaited

假如我们有一个 `Promise` 对象，这个 `Promise` 对象会返回一个类型。在 TS 中，我们用 `Promise` 中的 `T` 来描述这个 `Promise` 返回的类型。请你实现一个类型，可以获取这个类型。

例如：`Promise<ExampleType>`，请你返回 `ExampleType` 类型。

```ts
import type { Equal, Expect } from './test-utils'

type X = Promise<string>
type Y = Promise<{ field: number }>
type Z = Promise<Promise<string | number>>
type Z1 = Promise<Promise<Promise<string | boolean>>>
type T = { then: (onfulfilled: (arg: number) => any) => any }

type cases = [
  Expect<Equal<MyAwaited<X>, string>>,
  Expect<Equal<MyAwaited<Y>, { field: number }>>,
  Expect<Equal<MyAwaited<Z>, string | number>>,
  Expect<Equal<MyAwaited<Z1>, string | boolean>>,
  Expect<Equal<MyAwaited<T>, number>>,
]

```

#### 解析

题眼：获取类型，其实就是推断类型，自然会想到`infer`，但是当你这样写的的时候

```ts
type MyAwaited<T> = T extends Promise<infer U> ? U:never
```

你会发现只能匹配一层，上面的例子要求能够匹配多层，即要**实现递归**(所谓递归就是要再调用一次嘛)，这里还涉及到`PromiseLike`的类型使用，所以就有了

```ts
type MyAwaited<T extends PromiseLike<any>> = T extends PromiseLike<infer U>
  ? U extends PromiseLike<any> // 如果U是Promise，继续调用MyAwaited<U>
    ? MyAwaited<U>
    : U
  : never;
```

> `PromiseLike`是一个接口，它需要实现`thenable` 特征（实现`then`方法），也就是所有具有`thenable`特征的对象都是`PromiseLike`
> 
> `Promise`则是对`PromiseLike`的一个实现，也实现了接口中没有的`catch`和`finally`

### Parameters

实现内置的 Parameters 类型，而不是直接使用它，可参考[TypeScript官方文档](https://www.typescriptlang.org/docs/handbook/utility-types.html#parameterstype)。

```ts
const foo = (arg1: string, arg2: number): void => {}

type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]

// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

const foo = (arg1: string, arg2: number): void => {}
const bar = (arg1: boolean, arg2: { a: 'A' }): void => {}
const baz = (): void => {}

type cases = [
  Expect<Equal<MyParameters<typeof foo>, [string, number]>>,
  Expect<Equal<MyParameters<typeof bar>, [boolean, { a: 'A' }]>>,
  Expect<Equal<MyParameters<typeof baz>, []>>,
]

```

#### 解析

一看又是获取内置类型，就只要要用`infer`，要用infer，自然离不开`extends`，所以答案自然就出来了

```ts
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never
```

## Medium

### 获取函数返回类型

不使用`ReturnType`实现 TypeScript 的`ReturnType<T>`泛型。

```ts
// ============= Test Cases =============
import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<string, MyReturnType<() => string>>>,
  Expect<Equal<123, MyReturnType<() => 123>>>,
  Expect<Equal<ComplexObject, MyReturnType<() => ComplexObject>>>,
  Expect<Equal<Promise<boolean>, MyReturnType<() => Promise<boolean>>>>,
  Expect<Equal<() => 'foo', MyReturnType<() => () => 'foo'>>>,
  Expect<Equal<1 | 2, MyReturnType<typeof fn>>>,
  Expect<Equal<1 | 2, MyReturnType<typeof fn1>>>,
]

type ComplexObject = {
  a: [12, 'foo']
  bar: 'hello'
  prev(): number
}

const fn = (v: boolean) => v ? 1 : 2
const fn1 = (v: boolean, w: any) => v ? 1 : 2
```

#### 解析

又是获取类型，还是infer，所以答案就出来了

```ts
type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer U ? U : never;
```

### 实现Omit

不使用 `Omit`实现 TypeScript 的 `Omit<T, K>` 泛型。`Omit` 会创建一个省略 `K` 中字段的 `T` 对象。

```ts
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}
```

答案

```ts
type MyOmit<T, K extends keyof T> = {
  [
    P in keyof T
    as
    P extends K ? never : P
  ]: T[P]
}
```

这样写到底该怎么理解呢，我们以`as` 为分界，把这段代码分为 2 段

-   `P in keyof T` 是遍历的意思，这个好理解
-   `as` 在这里姑且认定为是 **断言**
-   `P extends K ? never : P` 这里是为了判断类型

连起来怎么看

-   `P`在 `T` 的范围循环
-   `P` 得到的是 `T` 中的键
-   对于这个 `P` 我们为他断言 为 `P / never`
-   如果 `P` 的这个键在 `K` 的范围中，我们就断言当前的 `P` 是 `never`（抛弃原先 `P` 的值），那么在对象循环的时候 `never` 就会被忽略掉，从而实现 `Omit`，参考 

::: tip
https://juejin.cn/post/7116117785830227981
:::

### 对象部分属性已读

实现一个泛型`MyReadonly2<T, K>`，它带有两种类型的参数`T`和`K`。类型 `K` 指定 `T` 中要被设置为只读 (`readonly`) 的属性。如果未提供`K`，则应使所有属性都变为只读，就像普通的`Readonly<T>`一样。

```ts
import type { Alike, Expect } from './test-utils'

type cases = [
  Expect<Alike<MyReadonly2<Todo1>, Readonly<Todo1>>>,
  Expect<Alike<MyReadonly2<Todo1, 'title' | 'description'>, Expected>>,
  Expect<Alike<MyReadonly2<Todo2, 'title' | 'description'>, Expected>>,
  Expect<Alike<MyReadonly2<Todo2, 'description' >, Expected>>,
]

// @ts-expect-error
type error = MyReadonly2<Todo1, 'title' | 'invalid'>

interface Todo1 {
  title: string
  description?: string
  completed: boolean
}

interface Todo2 {
  readonly title: string
  description?: string
  completed: boolean
}

interface Expected {
  readonly title: string
  readonly description?: string
  completed: boolean
}
```

很明显，解决这个问题要分**两种情况：**

1.  在`K`中但不在的属性，所有都要变成`readonly`
2.  不在`K`中的属性，原来是啥就是啥

所以答案很明显了

```ts
type MyReadonly2<T, K extends keyof T = keyof T> = {
  readonly[P in K] : T[P]  // 在K中，统一加上readonly
} & {
  [P in keyof T as P extends K  ? never: P] : T[P] // 在T中不在K中，原来是啥就是啥
}
```

### 元素转合集

实现泛型`TupleToUnion<T>`，它返回元组所有值的合集。

```ts
type Arr = ['1', '2', '3']
type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'

import type { Equal, Expect } from './test-utils'

type cases = [
  Expect<Equal<TupleToUnion<[123, '456', true]>, 123 | '456' | true>>,
  Expect<Equal<TupleToUnion<[123]>, 123>>,
]
```

#### 解析

跟easy模式下的第一题、第二题很像——

关键是怎么拿到数组（元组）中的元素，自然我们就会想到`T[number]`就表示数组某个下标的元素，所以答案也就很自然啦

```ts
type TupleToUnion<T extends any[] > = T[number]
```

### Promise.all

给函数`PromiseAll`指定类型，它接受元素为 `Promise` 或者类似 `Promise` 的对象的数组，返回值应为`Promise<T>`，其中T是这些 `Promise` 的结果组成的数组。

```ts
const promiseAllTest1 = PromiseAll([1, 2, 3] as const)
const promiseAllTest2 = PromiseAll([1, 2, Promise.resolve(3)] as const)
const promiseAllTest3 = PromiseAll([1, 2, Promise.resolve(3)])
const promiseAllTest4 = PromiseAll<Array<number | Promise<number>>>([1, 2, 3])

type cases = [
  Expect<Equal<typeof promiseAllTest1, Promise<[1, 2, 3]>>>,
  Expect<Equal<typeof promiseAllTest2, Promise<[1, 2, number]>>>,
  Expect<Equal<typeof promiseAllTest3, Promise<[number, number, number]>>>,
  Expect<Equal<typeof promiseAllTest4, Promise<number[]>>>,
]

```

 

```ts
declare function PromiseAll<T extends any[]>(values: readonly [...T]): Promise<{
  [key in keyof T]: Awaited<T[key]>
}>
```

### LookUp查找类型

有时，您可能希望根据某个属性在联合类型中查找类型。

在此挑战中，我们想通过在联合类型`Cat | Dog`中通过指定公共属性`type`的值来获取相应的类型。换句话说，在以下示例中，`LookUp<Dog | Cat, 'dog'>`的结果应该是`Dog`，`LookUp<Dog | Cat, 'cat'>`的结果应该是`Cat`。

```ts
interface Cat {
  type: 'cat'
  breeds: 'Abyssinian' | 'Shorthair' | 'Curl' | 'Bengal'
}

interface Dog {
  type: 'dog'
  breeds: 'Hound' | 'Brittany' | 'Bulldog' | 'Boxer'
  color: 'brown' | 'white' | 'black'
}

type MyDog = LookUp<Cat | Dog, 'dog'> // expected to be `Dog`
```

 

```ts
type LookUp<U, T> = U extends {type: T} ? U : never;
/**
  1. U是一个联合类型
  2. U extends {type:T}，表示在联合类型中筛选出符合{type：T}的那一个U，也就是我们要筛选出的目标所以答案显而易见，这个答案很巧妙
*/
```

 

```ts
type LookUp<T extends { type: string }, U extends string> = T extends unknown 
? T['type'] extends U 
  ? T 
  : never
: never

/**
  1. 这个也是自己的想法
  2. T['type'] extends U 表示找到T['type']的值符合U的哪个T，就是我们要找的T，否则就是never
*/ 
// 很疑惑的是为啥这样就不行呢？？
type LookUp<T extends { type: string }, U extends string> = T['type'] extends U ? T : never
// https://github.com/type-challenges/type-challenges/issues/149
看不懂

```

### TrimLeft

实现 `TrimLeft<T>` ，它接收确定的字符串类型并返回一个新的字符串，其中新返回的字符串删除了原字符串开头的空白字符串。

```ts
type trimed = TrimLeft<'  Hello World  '> // 应推导出 'Hello World  '

// 测试用例
type cases = [
  Expect<Equal<TrimLeft<'str'>, 'str'>>,
  Expect<Equal<TrimLeft<' str'>, 'str'>>,
  Expect<Equal<TrimLeft<'     str'>, 'str'>>,
  Expect<Equal<TrimLeft<'     str     '>, 'str     '>>,
  Expect<Equal<TrimLeft<'   \n\t foo bar '>, 'foo bar '>>,
  Expect<Equal<TrimLeft<''>, ''>>,
  Expect<Equal<TrimLeft<' \n\t'>, ''>>,
]
```

 

```ts
type Space = ' ' | '\n' | '\t'
type TrimLeft<S extends string> = S extends `${Space}${infer R}` ? TrimLeft<R> : S
```
