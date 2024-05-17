import type { ViteSSGContext } from 'vite-ssg'
import type { UserModule } from '~/types'

export const ctx: Partial<ViteSSGContext> = {}

export const install: UserModule = (_ctx) => {
  Object.assign(ctx, _ctx)
}
