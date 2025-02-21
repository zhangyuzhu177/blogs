<script setup lang="ts">
import User from '~/views/user/user/index.vue'
import Role from '~/views/user/role/index.vue'

const { menu, active } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <User v-if="menu[0].id === active" />
    <Role v-if="menu[1].id === active" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
