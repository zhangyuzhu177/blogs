---
description: RSA 非对称解密
outline: deep
---

# rsaDecrypt

## 方法说明

RSA 非对称解密

## 参数

| 参数名 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| hash | `string` | 待解密的密文 |  |
| privateKey | `string` | 私钥 |  |
| key | `string \| undefined` | 混淆的关键词 |  |

## 返回值

| 类型 | 描述 |
| --- | --- |
| `Promise<string>` | 解密后的字符串 |
