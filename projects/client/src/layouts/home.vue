<script setup lang="ts">
</script>

<!-- https://github.com/antfu/100/blob/main/src/utils/dark.ts -->

<template>
  <div class="bg" full>
    <AppHeader />
    <QScrollArea style="height: 100%; max-width:  100%;">
      <RouterView full />
    </QScrollArea>
  </div>
</template>

<style scoped lang="scss">
.bg {
  background-color:var(--grey-0);
}
</style>
