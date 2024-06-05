<script setup lang="ts">
import ArticleAdmin from '~/views/article/index.vue'

const { menu, active } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <ArticleAdmin v-if="menu[0].id === active" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
