---
description: 获取指定元素相对指定祖先元素的偏移量
outline: deep
---

# getOffsetRelativeToParent

## 方法说明

获取指定元素相对指定祖先元素的偏移量

## 参数

| 参数名 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| el | `HTMLElement \| undefined` | 目标元素 |  |
| parent | `HTMLElement \| undefined` | 目标祖先元素 |  |

## 返回值

| 类型 | 描述 |
| --- | --- |
| `{
    left: number;
    top: number;
}` | 偏移量 |
