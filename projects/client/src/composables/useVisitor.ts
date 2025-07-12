import { randomId } from 'utils'
import FingerprintJS from '@fingerprintjs/fingerprintjs'

const visitorId = ref()

export function useVisitor() {
  async function getVisitorId() {
    try {
      const fp = await FingerprintJS.load()
      const result = await fp.get()
      visitorId.value = result.visitorId
    }
    catch (e) {
      console.error(e)
      visitorId.value = randomId()
    }
  }

  return {
    visitorId,

    getVisitorId,
  }
}
