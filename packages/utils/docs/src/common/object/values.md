---
description: Object.values 的类型安全版本
outline: deep
---

# objectValues

## 方法说明

Object.values 的类型安全版本

## 参数

| 参数名 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| obj | `T` | 原始对象 |  |

## 返回值

| 类型 | 描述 |
| --- | --- |
| `Array<T[keyof T]>` | Object.values(obj) 的结果 |
