<script setup lang="ts">
import ArticleInfo from '~/views/article/ArticleInfo.vue'
</script>

<template>
  <Container :arrow="false">
    <div flex="~ gap4">
      <ArticleInfo />
    </div>
  </Container>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
