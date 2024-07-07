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

function changeTheme() {
  toggle()
}

watch(() => isDark.value, () => {
  dark.value = isDark.value
})
</script>

<template>
  <div flex="~ gap1" b-rd justify-end items-center>
    <q-btn flat round @click="changeTheme">
      <div v-if="!dark" w-6 h-6 i-ph:sun-bold />
      <div v-else w-6 h-6 i-ph:moon-bold />
    </q-btn>
    <q-btn flat round>
      <a href="https://github.com/ZhangYuzhu1" target="_blank">
        <div w-6 h-6 i-mingcute:github-line />
      </a>
    </q-btn>
  </div>
</template>

<style scoped lang="scss">
</style>
