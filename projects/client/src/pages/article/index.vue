<script setup lang="ts">
import ArticleList from '~/views/article/ArticleList.vue'
</script>

<template>
  <Container>
    <div flex="~ gap4">
      <ArticleList />
      <div>
        <RouterView />
      </div>
    </div>
  </Container>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
