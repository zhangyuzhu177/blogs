<script setup lang="ts">
</script>

<!-- https://github.com/antfu/100/blob/main/src/utils/dark.ts -->

<template>
  <div class="bg" full flex="~ col">
    <AppHeader />
    <main>
      <RouterView full />
    </main>
    <AppFooter />
  </div>
</template>

<style lang="scss">
.bg {
  background-color: var(--grey-1);
}
</style>
