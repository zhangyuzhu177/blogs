<script setup lang="ts">
import ArticleList from '~/views/article/list/index.vue'
import ArticleType from '~/views/article/type/index.vue'
import ArticleTag from '~/views/article/tag/index.vue'

const { menu, active } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <ArticleList v-if="menu[0].id === active" />
    <ArticleType v-if="menu[1].id === active" />
    <ArticleTag v-if="menu[2].id === active" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
