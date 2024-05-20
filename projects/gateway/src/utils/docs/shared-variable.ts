import { wrap } from './wrap'

export function sharedVariableMarkdown(
  variableName: string,
  from = 'zjf-utils',
  name = '描述信息',
) {
  return (
    wrap(`${name}可从${from}中获取`)
    + wrap('```ts')
    + wrap(`import { ${variableName} } from '${from}'`)
    + wrap('```')
  )
}
