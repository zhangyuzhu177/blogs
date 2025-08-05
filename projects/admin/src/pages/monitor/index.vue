<script setup lang="ts">
import ServerMonitor from '~/views/monitor/serverMonitor/index.vue'

const { menu, active } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <ServerMonitor v-if="menu[0].id === active" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
