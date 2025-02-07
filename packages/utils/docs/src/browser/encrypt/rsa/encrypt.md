---
description: RSA 非对称加密
outline: deep
---

# rsaEncrypt

## 方法说明

RSA 非对称加密

## 参数

| 参数名 | 类型 | 描述 | 默认值 |
| --- | --- | --- | --- |
| value | `string` | 待加密的字符串 |  |
| publicKey | `string` | 公钥 |  |
| key | `string \| undefined` | 混淆的关键词 |  |

## 返回值

| 类型 | 描述 |
| --- | --- |
| `Promise<string>` | 加密后的密文 |
