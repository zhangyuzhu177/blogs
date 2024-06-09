<script setup lang="ts">
import ArticleList from '~/views/article/ArticleList.vue'
import UpsertArticle from '~/views/article/UpsertArticle.vue'

const { menu, active } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <ArticleList v-if="menu[0].id === active" />
    <UpsertArticle v-if="menu[1].id === active" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
