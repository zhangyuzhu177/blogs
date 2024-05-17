import type { UserModule } from '~/types'

export const install: UserModule = ({ isClient, router }) => {
  if (isClient) {
    router.beforeEach(async (to, _, next) => {
      next()
    })
  }
}
