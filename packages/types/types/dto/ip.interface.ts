/** ip 地址 */
export interface IIpDto {
  /** ip 地址 */
  ip: string
}

/** ip 地址（可选） */
export interface IIpOptionalDto extends Partial<IIpDto> {}
