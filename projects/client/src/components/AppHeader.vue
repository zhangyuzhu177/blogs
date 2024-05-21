<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

export type Theme = 'light' | 'dark'

const { width } = useWindowSize()

const theme = ref<Theme>('dark')

nextTick(() => {
  const { y } = useScroll(document?.querySelector('.q-scrollarea__container') as HTMLElement)
  watch(
    [width, y],
    ([newWidth, newY]) => {
      if (newWidth >= 600 && newY <= 200)
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
    w-full h-16 flex="~ gap10"
    justify-between items-center px-6
    fixed z-9 top-0 left-0
    :border="theme === 'dark' ? 'transparent' : 'grey-3'"
    :bg="theme === 'dark' ? 'transparent' : 'grey1'"
  >
    <div flex="~ gap2" items-center>
      <Navigation2 v-if="width < 600" />
      <div>
        logo
      </div>
    </div>
    <Navigation1 v-if="width >= 600" />
    <Tags />
  </div>
</template>
