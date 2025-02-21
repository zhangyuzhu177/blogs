---
description: 判断 ipv4 地址是否在指定的范围内
outline: deep
---

# ipv4Between

## 方法说明

判断 ipv4 地址是否在指定的范围内

## 参数

| 参数名 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| ip | `any` | ipv4 地址 |  |
| lowerBound | `any` | 指定范围的下界 |  |
| upperBound | `any` | 指定范围的上界 |  |

## 返回值

| 类型 | 描述 |
| --- | --- |
| `boolean \| null` | 是否在指定范围内（如果任意参数不是 ipv4 地址，则返回 null） |
