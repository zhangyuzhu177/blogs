<script setup lang="ts">
import ArticleInfo from '~/views/article/ArticleInfo.vue'
</script>

<template>
  <div full flex="~ col center">
    <Images height="600px" :arrow="false" w-full />
    <div relative z-1 w-full pt-16 pb-16 flex="~ center">
      <div xl="px-0" lg="px-6" px-4 full>
        <ArticleInfo />
        <ScrollTop />
      </div>
      <ArtPlum />
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
