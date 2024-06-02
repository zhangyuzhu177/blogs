<script setup lang="ts">
</script>

<!-- https://github.com/antfu/100/blob/main/src/utils/dark.ts -->

<template>
  <div class="bg" full>
    <AppHeader />
    <RouterView full />
  </div>
</template>

<style lang="scss">
.bg {
  background-color:var(--grey-2);
}
</style>
