<script setup lang="ts">
import Home from '~/views/home/Home.vue'
import PageAdmin from '~/views/home/PageAdmin.vue'

const { active, menu } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <Home v-if="active===menu[0].id" />
    <PageAdmin v-if="active===menu[1].id"/>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
