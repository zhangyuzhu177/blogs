<script setup lang="ts">
import { isClient } from '@vueuse/core'

const { width } = useWindowSize()
const { isAdmin, zoomRatio, getAppConfig } = useSysConfig()
const $router = useRouter()
const { updateAppHead } = useApp()
const { scrollEl } = useClientApp()

onBeforeMount(() => {
  isAdmin.value = false
  $router.replace({ query: undefined })
  getAppConfig()

  const { VITE_CLIENT_APP_NAME, VITE_CLIENT_APP_ICON } = import.meta.env

  updateAppHead(VITE_CLIENT_APP_NAME, VITE_CLIENT_APP_ICON)
})

/** 监听窗口大小，缩放页面 */
watch(
  width,
  (newVal) => {
    if (isClient) {
      nextTick(() => {
        const body = document.body
        if (body) {
          if (newVal < APP_MIN_WIDTH) {
            const ratio = zoomRatio.value
            body.style.transform = `scale(${ratio})`
            body.style.width = `${100 / ratio}%`
            body.style.height = `${100 / ratio}%`
          }
          else {
            body.style.transform = ''
            body.style.width = '100%'
            body.style.height = '100%'
          }
        }
      })
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <QScrollArea ref="scrollEl" full>
    <RouterView min-w-600px />
  </QScrollArea>
</template>

<style lang="scss" scoped>
.q-scrollarea {
  :deep(.q-scrollarea__content) {
    width: 100% !important;
  }
}
</style>
./hooks/app
