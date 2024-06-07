<script setup lang="ts">
import UserInfo from '~/views/user/userInfo/index.vue'

const { menu, active } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <UserInfo v-if="menu[0].id === active" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
