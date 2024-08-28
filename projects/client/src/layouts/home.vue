<script setup lang="ts">
</script>

<!-- https://github.com/antfu/100/blob/main/src/utils/dark.ts -->

<template>
  <div class="bg" full flex="~ col">
    <AppHeader />
    <main class="main" pb-14>
      <RouterView full z-1 />
    </main>
    <AppFooter />
  </div>
</template>

<style lang="scss">
.bg {
  background-color: var(--grey-2);
}
// .main {
//   position: relative;
//   background-color: var(--grey-2-a3);
  // background: radial-gradient(circle, var(--grey-2) , var(--grey-2-a0) 700%);

//   &::before {
//     content: '';
//     inset: 0;
//     position: absolute;
//     z-index: -1;
//     background-image: url('../assets/img/bg.png');
//     background-repeat: repeat;
//   }
// }
</style>
