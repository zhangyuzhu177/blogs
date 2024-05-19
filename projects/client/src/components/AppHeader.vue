<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'

const { width } = useWindowSize()
</script>

<template>
  <div
    w-full h-16 flex="~ gap10"
    justify-between items-center px-6
    fixed z-9 top-0 left-0
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
