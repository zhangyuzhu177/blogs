const fs = require('node:fs')
const path = require('node:path')

const ts = require('typescript')

const srcDir = path.join(__dirname, '..', 'src')
const esmDir = path.join(__dirname, '..', 'dist/esm')
const docsSrcDir = path.join(__dirname, '..', 'docs', 'src')
const utilJsonPath = path.join(
  __dirname,
  '..',
  'docs',
  '.vitepress',
  'utils.json',
)

const utilsJson = []

/**
 * 列出指定目录下全部的文件，返回文件名称列表
 * @param {string} dir
 * @return {string[]} 文件名称列表
 */
async function listDir(dir) {
  return fs.promises.readdir(dir)
}

/**
 * 校验一个目录是否是文件夹
 * @param {string} path
 * @return {boolean}
 */
async function isDir(path) {
  return (await fs.promises.stat(path)).isDirectory()
}

/**
 * 递归遍历
 * @param {string} dir
 * @param {string[]} pathArr
 * @return {void}
 */
async function travel(dir, pathArr = []) {
  const files = await listDir(dir)
  for (const file of files) {
    const fullPath = path.join(dir, file)
    const is_dir = await isDir(fullPath)
    if (is_dir)
      await travel(fullPath, [...pathArr, file])
    else
      await handler(file, pathArr)
  }
}

/**
 * 每个文件的处理方法
 * @param {string} file 文件名称
 * @param {string[]} pathArr 目录前缀
 */
async function handler(file, pathArr = []) {
  if (
    file.endsWith('.map')
    || file.endsWith('.js')
    || file.startsWith('index')
    || file.endsWith('.doc.md')
  )
    return

  const docFile = file.replace(/^(.+)\.d.ts$/, '$1')
  const docFilename = `${docFile}.md`
  const manualDocFilename = `${docFile}.doc.md`
  updateUtils(pathArr, docFile)

  const docTargetDir = path.join(docsSrcDir, ...pathArr)
  if (!fs.existsSync(docTargetDir))
    fs.mkdirSync(docTargetDir, { recursive: true })

  const docPath = path.join(docsSrcDir, ...pathArr, docFilename)
  const manualDocPath = path.join(srcDir, ...pathArr, manualDocFilename)
  let manualDoc
  let oldDoc

  if (manualDocPath && fs.existsSync(manualDocPath))
    manualDoc = fs.readFileSync(manualDocPath).toString()

  if (docPath && fs.existsSync(docPath))
    oldDoc = fs.readFileSync(docPath).toString()
  if (manualDoc)
    return fs.writeFileSync(docPath, manualDoc)

  const dtsRaw = fs
    .readFileSync(path.join(esmDir, ...pathArr, file))
    .toString()
  const dts = await parseDTS(dtsRaw)
  if (!dts)
    return

  const newMdContent = buildMarkdownContent(dts)
  const oldMdContent = oldDoc ? oldDoc.replace(/---[\s\S]*?---/, '') : ''
  if (newMdContent.trim() === oldMdContent.trim())
    return

  const newMdConfig = buildMarkdownConfig(dts)
  const markdown = `${newMdConfig}\n${newMdContent}`
  fs.writeFileSync(docPath, markdown)
}

/**
 * 更新 utils.json 汇总信息
 * @param {string[]} prefix
 * @param {string} name
 */
function updateUtils(prefix, name) {
  let pointer = utilsJson
  for (let i = 0; i < prefix.length; i++) {
    const name = prefix[i]
    const match = pointer.find(item => item.text === name)
    if (match) {
      pointer = match.items
    }
    else {
      const item = {
        text: name,
        items: [],
      }
      pointer.push(item)
      pointer = item.items
    }
  }
  pointer.push({
    text: name,
    link: `/${prefix.join('/')}/${name}`,
  })
}

/**
 * 解析 dts 文件，返回命中的第一个函数信息
 * @param {string} dts
 * @return {Promise<{
 *  name: string
 *  description: string
 *  parameters: {
 *    name: string
 *    description: string
 *    type: string
 *    default: string
 *  }[]
 *  returnType: string
 *  returnComment: string
 * } | undefined>}
 */
function parseDTS(dts) {
  return new Promise((resolve) => {
    const sourceFile = ts.createSourceFile(
      'test.ts',
      dts,
      ts.ScriptTarget.ESNext,
      true,
      ts.ScriptKind.TSX,
    )

    // 遍历语法树，解析函数信息
    ts.forEachChild(sourceFile, (node) => {
      if (ts.isFunctionDeclaration(node) && node.name) {
        const name = node.name.text
        const description = node.jsDoc?.[0].comment ?? ''
        const parameters = node.parameters.map((param) => {
          const paramName = param.name.getText(sourceFile)
          const paramDescription
            = param.jsDoc?.[0]?.comment
            ?? node.jsDoc?.[0]?.tags.find(v => (
              v.tagName.escapedText === 'param' && v.name?.text === paramName
            ))?.comment
            ?? ''
          let type = param.type
            ? param.type.getText(sourceFile)?.replace(/\|/g, '\\|')
            : 'any'
          if (param.type && param.questionToken)
            type += ' \\| undefined'
          const defaultValue
            = node.jsDoc?.[0]?.tags.find(v => (
              v.tagName.escapedText === 'default'
            ))?.comment.split('\n').map(v => v.trim().split(' '))
              ?.find(v => v[0] === paramName)?.[1]
            ?? ''
          return {
            name: paramName,
            description: paramDescription,
            type,
            default: defaultValue,
          }
        })
        const returnType = node.type?.getText(sourceFile) ?? 'void'
        const returnComment = ts.getJSDocReturnTag(node)?.comment ?? ''
        resolve({ name, description, parameters, returnType, returnComment })
      }
    })
    resolve()
  })
}

/**
 * 将解析后的dts转换为markdown
 * @param {*} dts
 */
function buildMarkdownContent(dts) {
  let md = ''
  const { name, description, parameters, returnType, returnComment } = dts

  md += `# ${name}\n\n`
    + '## 方法说明\n\n'
    + `${description}\n\n`
    + '## 参数\n\n'

  const table = '| 参数名 | 类型 | 描述 | 默认值 |\n'
    + `| --- | --- | --- | --- |\n${
     parameters
      .map((param) => {
        return `| ${param.name} | \`${param.type}\` | ${param.description} | ${param.default} |`
      })
      .join('\n')}`

  md += `${table}\n\n`
    + '## 返回值\n\n'
    + '| 类型 | 描述 |\n'
    + '| --- | --- |\n'
    + `| \`${returnType.replace(/\|/g, '\\|')}\` | `
    + `${returnComment.replace(/\|/g, '\\|')} |\n`

  return md
}

function buildMarkdownConfig(dts) {
  const { description } = dts
  const descriptionFirstLine = description.split('\n')[0]
  return '---\n'
    + `description: ${descriptionFirstLine}\n`
    + 'outline: deep\n'
    + '---\n'
}

async function main() {
  await travel(esmDir)
  const jsonRaw = JSON.stringify(utilsJson, null, 2)
  fs.writeFileSync(utilJsonPath, jsonRaw)
}

main()
