<script setup lang="ts">
</script>

<template>
  <div full flex="~ col center gap14">
    <Images w-full />
    <div
      xl="w-1280px" lg="px-6" w-full
      h="100vh" px-4
    >
      <slot />
      <ScrollTop />
    </div>
  </div>
</template>
