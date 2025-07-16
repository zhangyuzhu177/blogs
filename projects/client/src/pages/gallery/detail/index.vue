<script setup lang="ts">
import Detail from '~/views/gallery/detail/detail.vue'
</script>

<template>
  <div
    w-full py-16 md:pb-30 relative
    flex="~ 1 justify-center"
  >
    <div
      flex="~ 1 col"
      lg="max-w-1080px px-0" sm="px-6"
      px-4
    >
      <Detail />
      <ScrollTop />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
