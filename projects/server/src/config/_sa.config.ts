import { registerAs } from '@nestjs/config'

export interface SysAdmin {
  account: string
  password: string
}
// SYS_ADMIN = 'admin@admin123!!!'
export default registerAs('sa', () => ({
  list: (process.env.SYS_ADMIN || '').replace(/\s+/g, '').split(',').map((item) => {
    const [account, password] = item.trim().split('@')
    return { account, password } as SysAdmin
  }),
}))
