/**
 * 深层复制
 * @param data
 * @returns
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function deepCopy(data: Object) {
  return JSON.parse(JSON.stringify(data))
}

/**
 * 分割字符串
 * @param str
 * @param len
 * @returns
 */
export function splitString(str: string, len: number) {
  const regex = new RegExp(`.{1,${len}}`, 'g')
  const result = str.match(regex)

  return result?.join('\n') || str
}

/**
 * 获取小数位数
 * @param num
 * @returns
 */
export function getDecimalPlaces(num: number) {
  const match = num.toString().match(/(?:\.(\d+))?(?:e([+-]?\d+))?$/i)
  if (!match)
    return 0
  return Math.max(
    0,
    // 将科学计数法转换为整数，获取有效数字的位数
    (match[1] ? match[1].length : 0) - (match[2] ? +match[2] : 0),
  )
}

/**
 * 生成唯一id
 * @returns
 */
export function getId() {
  const s = []
  const hexDigits = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  for (let i = 0; i < 15; i++)
    s[i] = hexDigits.substr(Math.floor(Math.random() * 36), 1)
  s[5] = s[10] = '-'
  return s.join('')
}
