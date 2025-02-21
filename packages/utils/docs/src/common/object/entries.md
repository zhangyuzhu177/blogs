---
description: Object.entries 的类型安全版本
outline: deep
---

# objectEntries

## 方法说明

Object.entries 的类型安全版本

## 参数

| 参数名 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| obj | `T` | 原始对象 |  |

## 返回值

| 类型 | 描述 |
| --- | --- |
| `Array<[keyof T, T[keyof T]]>` | Object.entries(obj) 的结果 |
