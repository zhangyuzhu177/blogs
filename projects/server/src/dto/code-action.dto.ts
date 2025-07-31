import { decorate } from 'ts-mixer'
import { IsEnum } from 'class-validator'
import type { ICodeActionDto } from 'types'
import { ApiProperty } from '@nestjs/swagger'
import { objectEntries } from '@catsjuice/utils'
import { CodeAction, codeActionDescriptions } from 'types'
import { sharedVariableMarkdown } from 'src/utils/docs/shared-variable'

export class CodeActionDto implements ICodeActionDto {
  @decorate(ApiProperty({
    description: `发送验证码的目的
    \n${objectEntries(codeActionDescriptions).map(([key, value]) => `- \`${key}\`: ${value}`).join('\n')}
    ${sharedVariableMarkdown('CodeAction', 'blogs', 'action枚举值')}`,
    enum: CodeAction,
    example: CodeAction.REGISTER,
  }))
  @decorate(IsEnum(CodeAction, { message: 'action必须是 CodeAction 枚举值' }))
  action: CodeAction
}
