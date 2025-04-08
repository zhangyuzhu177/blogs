<script setup lang="ts">
import { isClient } from '@vueuse/core'

export type Theme = 'light' | 'dark'

const router = useRouter()
const { width } = useWindowSize()

const theme = ref<Theme>('dark')

nextTick(() => {
  if (!isClient)
    return

  const { y } = useScroll(document?.querySelector('.q-scrollarea__container') as HTMLElement)
  watch(
    [y, width],
    (newValue) => {
      if (newValue[0] || newValue[1] <= 600)
        theme.value = 'dark'
      else
        theme.value = 'light'
    },
    { immediate: true },
  )
})
</script>

<template>
  <header
    fixed z-9 top-0 left-0 px-6 w-full h-16
    :class="theme === 'dark' ? 'bg' : ''"
    :border="theme === 'dark' ? 'transparent' : 'grey-3'"
    :bg="theme === 'dark' ? 'transparent' : ''"
  >
    <!-- Logo -->
    <div full flex="~ justify-end items-center" relative>
      <ArtLogo
        absolute left-0 top-0
        cursor-pointer
        @click="router.push('/')"
      />
      <div flex="~ gap2">
        <Navigation v-if="width > 600" />
        <Menu v-else />
        <Dark />
      </div>
    </div>
  </header>
</template>

<style scoped lang="scss">
.bg {
  background-color: var(--grey-2-a2);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--grey-3-a5);
}
</style>
