<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

export type Theme = 'light' | 'dark'

const router = useRouter()

const { width } = useWindowSize()
const { app } = useSysConfig()

const theme = ref<Theme>('dark')

nextTick(() => {
  const { y } = useScroll(document?.querySelector('.q-scrollarea__container') as HTMLElement)
  watch(
    [width, y],
    ([newWidth, newY]) => {
      if (newWidth >= 900 && newY <= 100)
        theme.value = 'dark'
      else
        theme.value = 'light'
    },
    { immediate: true },
  )
})
</script>

<template>
  <div
    v-if="app?.nameEn"
    w-full h-16 flex="~ gap10"
    justify-between items-center px-6
    fixed z-9 top-0 left-0
    :class="theme === 'dark' ? 'transparent' : 'bg'"
    :border="theme === 'dark' ? 'transparent' : 'grey-3'"
    :bg="theme === 'dark' ? 'transparent' : ''"
  >
    <div flex="~ items-center gap4 1">
      <!-- Logo -->
      <div
        class="font-marij" text="32px" cursor-pointer
        @click="router.push('/')"
        v-text="app.nameEn"
      />
      <Navigation1 />
    </div>
    <Tags />
  </div>
</template>

<style scoped lang="scss">
.bg{
  background-color: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
</style>
