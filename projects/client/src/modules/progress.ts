import Particles from '@tsparticles/vue3'
import { loadSlim } from '@tsparticles/slim'
import type { UserModule } from '~/types'

export const install: UserModule = ({ app, isClient }) => {
  if (!isClient)
    return
  app.use(Particles, {
    init: async (engine) => {
      await loadSlim(engine)
    },
  })
}
