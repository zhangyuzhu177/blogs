---
description: 将 number 的字符串描述转换为整数，如果无法转换则返回 undefined 或 默认值
outline: deep
---

# parseIntRaw

## 方法说明

将 number 的字符串描述转换为整数，如果无法转换则返回 undefined 或 默认值

## 参数

| 参数名 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| src | `string \| boolean \| number \| undefined` | 要转换的值 |  |
| defaultValue | `T \| undefined` | 默认值 |  |

## 返回值

| 类型 | 描述 |
| --- | --- |
| `T extends number ? number : number \| undefined` | 返回转换后的 number 值 |
