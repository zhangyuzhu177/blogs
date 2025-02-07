---
description: 校验一个字符串是否符合要求的长度
outline: deep
---

# validateLength

## 方法说明

校验一个字符串是否符合要求的长度

## 参数

| 参数名 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| label | `string` | 参数标签 |  |
| value | `string \| undefined` | 待校验的字符串 |  |
| min | `number \| undefined` | 最小长度 |  |
| max | `number \| undefined` | 最大长度 |  |

## 返回值

| 类型 | 描述 |
| --- | --- |
| `string` | 如果符合要求，返回空字符串，否则返回错误信息 |
