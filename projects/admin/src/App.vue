<script setup lang="ts">
import { isClient } from '@vueuse/core'

const { width } = useWindowSize()
const { isAdmin, zoomRatio } = useSysConfig()
// const $router = useRouter()

onBeforeMount(() => {
  isAdmin.value = true
  // $router.replace({ query: undefined })
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
  <RouterView />
</template>
