<script setup lang="ts">
import img from '~/assets/defaultBg.jpg'
</script>

<template>
  <div class="">
    <div w-25 h-25 b-rd="50%">
      <img flex b-rd="50%" class="avatar" full :src="img" alt="">
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar {
  &::before, &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }
  &::before {
    background-color: red;
  }
}
</style>
