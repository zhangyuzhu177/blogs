<script setup lang="ts">
import icon from '~/assets/img/403.png'
</script>

<template>
  <div full flex="~ center" px-4>
    <div flex="~ col items-center" relative bottom="10%">
      <img w-250px h-250px :src="icon" alt="">
      <div text-lg v-text="'您没有访问权限'" />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
