/**
 * 使用 Promise 封装 setTimeout，使其支持 async/await
 * @param time 等待的时长，单位为 ms
 * @returns 封装后的Promise
 */
export function sleep(time: number) {
  return new Promise(resolve => setTimeout(resolve, time))
}
