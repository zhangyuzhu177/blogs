import type { QScrollArea } from 'quasar'

const scrollEl = ref<QScrollArea>()

export function useClientApp() {
  return {
    scrollEl,
  }
}
