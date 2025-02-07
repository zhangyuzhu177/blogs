import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'

import { glob } from 'glob'

/** 根目录 */
const ROOT_DIR = process.cwd()
/** 入口文件（index.ts）路径 */
const INDEX = path.join(ROOT_DIR, 'index.ts')

/** 枚举值 */
const enums = await glob('./types/**/*.enum.ts', { cwd: process.cwd() })
/** 常量 */
const constants = await glob('./types/**/*.constant.ts', { cwd: process.cwd() })
/** 接口 */
const interfaces = await glob('./types/**/*.interface.ts', { cwd: process.cwd() })

/**
 * 过滤掉文件名以 `_` 开头的文件
 * @param {string} p 文件路径
 */
function filter(p) {
  const name = path.basename(p, '.ts')
  return !name.startsWith('_')
}

/**
 * 获取导出的代码
 * @param {string} p 文件路径
 */
function exportCode(p) {
  const name = path.basename(p, '.ts')
  const dir = path.dirname(p)
  const relative = path.relative(ROOT_DIR, dir)
  const importPath = path.join(relative, name).replaceAll('\\', '/')
  return `export * from './${importPath}'`
}

/**
 * 根据路径字母顺序排序
 * @param {string} a
 * @param {string} b
 */
function sortByName(a, b) {
  return a.localeCompare(b)
}

/**
 * 根据路径长度排序
 * @param {string} a
 * @param {string} b
 */
function sortByLength(a, b) {
  return a.length - b.length
}

const enumImports = enums.filter(filter).map(exportCode).sort(sortByName).sort(sortByLength)
const constantImports = constants.filter(filter).map(exportCode).sort(sortByName).sort(sortByLength)
const interfaceImports = interfaces.filter(filter).map(exportCode).sort(sortByName).sort(sortByLength)

const imports = [
  '/**',
  ' * 这个文件是通过 `scripts/auto-export.mjs` 脚本自动生成的，不要手动修改',
  ' */',
  '',
  '// Enums',
  ...enumImports,
  '',
  '// Constants',
  ...constantImports,
  '',
  '// Interfaces',
  ...interfaceImports,
]

fs.writeFileSync(INDEX, `${imports.join('\n')}\n`)
