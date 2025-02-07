/** 是否发送邮件 */
export interface ISendEmailDto {
  /** 是否发送邮件 */
  sendEmail: boolean
}

/** 是否发送邮件（可选） */
export interface ISendEmailOptionalDto extends Partial<ISendEmailDto> {}
