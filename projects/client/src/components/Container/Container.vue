<script setup lang="ts">
</script>

<template>
  <div
    relative w-full py-16
    flex="~ justify-center"
  >
    <div
      lg="max-w-1080px px-0" sm="px-6"
      px-4 full
    >
      <slot />
      <ScrollTop />
    </div>
  </div>
</template>
