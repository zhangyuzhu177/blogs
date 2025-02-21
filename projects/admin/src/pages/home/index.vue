<script setup lang="ts">
import PageAdmin from '~/views/home/PageAdmin/index.vue'

const { active, menu } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <PageAdmin v-if="active === menu[0].id" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
