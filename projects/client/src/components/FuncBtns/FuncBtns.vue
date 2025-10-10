<script setup lang="ts">
const isDark = useDark({
  selector: 'html',
  attribute: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})
const dark = useStorage('dark', useColorMode().value)

const toggle = useToggle(isDark)

watch(
  isDark,
  () => {
    dark.value = useColorMode().value
  },
)

/**
 * 主题切换
 */
function toggleTheme(event: any) {
  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(
    Math.max(x, innerWidth - x),
    Math.max(y, innerHeight - y),
  )

  // 兼容性处理
  if (!(document as any).startViewTransition) {
    toggle()
    return
  }
  const transition = (document as any).startViewTransition(async () => {
    toggle()
  })

  transition.ready.then(() => {
    const clipPath = [
      `circle(0px at ${x}px ${y}px)`,
      `circle(${endRadius}px at ${x}px ${y}px)`,
    ]
    document.documentElement.animate(
      {
        clipPath: isDark.value ? [...clipPath].reverse() : clipPath,
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isDark.value
          ? '::view-transition-old(root)'
          : '::view-transition-new(root)',
      },
    )
  })
}
</script>

<template>
  <div flex="~ items-center gap2" b-rd>
    <SearchBtn />
    <q-btn flat round @click="toggleTheme">
      <div v-if="dark === 'light'" size-5 i-ph:sun-bold />
      <div v-else size-5 i-ph:moon-bold />
    </q-btn>
  </div>
</template>

<style lang="scss">
:deep(.q-btn){
  .q-focus-helper {
    display: none;
  }

  .q-ripple {
    display: none;
  }

  .q-tab__indicator{
    display: none;
  }
}
</style>
