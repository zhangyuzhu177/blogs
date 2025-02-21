---
description: 将 boolean 的字符串描述转换为 boolean 值，如果无法转换则返回 undefined 或 默认值
outline: deep
---

# parseBoolRaw

## 方法说明

将 boolean 的字符串描述转换为 boolean 值，如果无法转换则返回 undefined 或 默认值

- true 值的描述：`true`, `yes`, `1`, `TRUE`, `YES`, `True`, `Yes`
- false 值的描述：`false`, `no`, `0`, `FALSE`, `NO`, `False`, `No`

## 参数

| 参数名 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| src | `string \| boolean \| number \| undefined` | 要转换的值 |  |
| defaultValue | `T \| undefined` | 默认值 |  |

## 返回值

| 类型 | 描述 |
| --- | --- |
| `T extends boolean ? boolean : boolean \| undefined` | 返回转换后的 boolean 值 |
