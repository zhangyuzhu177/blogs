<script setup lang="ts">
import ArticleList from '~/views/home/ArticleList.vue'
</script>

<template>
  <Container>
    <div flex="~ gap4">
      <ArticleList />
    </div>
  </Container>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
