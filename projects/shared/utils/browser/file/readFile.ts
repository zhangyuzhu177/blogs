/**
 * 读取文件中的文本内容
 * @param file 要读取的文件
 * @returns 文件中的文本内容
 */
export function readFile(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = function (event) {
      const content = event.target?.result
      resolve(content)
    }

    reader.onerror = function (event) {
      reject(event.target?.error)
    }

    reader.readAsText(file)
  })
}
