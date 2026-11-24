---
description: "const xxx as const 是 TypeScript 中的一种类型断言语法，主要用于将表达式的值转换为其字面量类型，并保持其不可变性。下面详细解释其功能和使用场景：核心作用锁定类型为字面量值：将变量类型从宽泛的原始类型（如 string、number）限制为具体的字面量值保持深层不可..."
source: "https://www.yuque.com/alipayqxigqpgusn/rs8s8g/wsqvwaotthrbttnp"
updated: "2025-09-29T07:42:34.000Z"
---

# const xxx as const

> 来源：语雀「前端」 · [查看原文](https://www.yuque.com/alipayqxigqpgusn/rs8s8g/wsqvwaotthrbttnp)

<details class="toc-details">
<summary>本页结构（7 个小节）</summary>

- 核心作用
- 具体效果对比
- 基本类型示例
- 对象示例
- 数组示例
- 常见使用场景
- 注意事项

</details>

`const xxx as const` 是 TypeScript 中的一种**类型断言语法**，主要用于**将表达式的值转换为其字面量类型，并保持其不可变性**。下面详细解释其功能和使用场景：

## 核心作用

1.  **锁定类型为字面量值**：将变量类型从宽泛的原始类型（如 `string`、`number`）限制为具体的字面量值
2.  **保持深层不可变性**：对于对象和数组，递归地将所有属性标记为 `readonly`

## 具体效果对比

### 基本类型示例

不使用 `as const`：

```ts
const color = 'red'; // 类型被推断为 string
color = 'blue'; // 错误：不能重新赋值给 const 变量
```

使用 `as const`：

```ts
const color = 'red' as const; // 类型被推断为 'red' 字面量类型
```

### 对象示例

不使用 `as const`：

```ts
const config = {
  host: 'localhost',
  port: 3000
}; // 类型被推断为 { host: string, port: number }
config.host = '127.0.0.1'; // 可以修改属性
```

使用 `as const`：

```ts
const config = {
  host: 'localhost',
  port: 3000
} as const; // 类型被推断为 { readonly host: 'localhost', readonly port: 3000 }
config.host = '127.0.0.1'; // 错误：不能修改 readonly 属性
```

### 数组示例

不使用 `as const`：

```ts
const numbers = [1, 2, 3]; // 类型被推断为 number[]
numbers.push(4); // 可以修改数组
```

使用 `as const`：

```ts
const numbers = [1, 2, 3] as const; // 类型被推断为 readonly [1, 2, 3]
numbers.push(4); // 错误：readonly 数组没有 push 方法
```

## 常见使用场景

1.  **配置对象**：确保配置不会被意外修改
2.  **枚举替代**：在不需要完整枚举功能时，可以用 `as const` 创建常量集合
3.  **字面量类型保护**：确保变量只能是特定的几个值之一
4.  **TypeScript 类型体操**：在复杂类型操作中保持类型的精确性

## 注意事项

-   `**as const**` **比** `**const**` **声明更严格，**`**const**` **只保证变量引用不变，而** `**as const**` **还保证值的内容不变**
-   对于函数参数，不能直接使用 `as const`，需要在调用时使用：

```ts
function processConfig(config: { readonly host: string; readonly port: number }) {}
processConfig({ host: 'localhost', port: 3000 } as const);
```

-   TypeScript 3.4 及以上版本支持此语法
