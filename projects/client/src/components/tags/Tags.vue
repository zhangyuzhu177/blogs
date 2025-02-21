<script setup lang="ts">
import { useDark, useStorage, useToggle } from '@vueuse/core'

const isDark = useDark({
  selector: 'html',
  attribute: 'theme',
  valueDark: 'dark',
  valueLight: 'light',
})

const dark = useStorage('dark', isDark.value)

const toggle = useToggle(isDark)

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

watch(isDark,
  () => {
    dark.value = isDark.value
  },
)
</script>

<template>
  <div class="tags" flex="~ gap2" b-rd justify-end items-center>
    <q-btn flat round @click="toggleTheme">
      <div v-if="dark" size-5 i-ph:sun-bold />
      <div v-else size-5 i-ph:moon-bold />
    </q-btn>
    <q-btn flat round href="https://github.com/zhangyuzhu177" target="_blank">
      <div size-5 i-mingcute:github-line />
    </q-btn>
  </div>
</template>

<style scoped lang="scss">
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
