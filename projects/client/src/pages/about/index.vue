<script setup lang="ts">
import About from '~/views/about/index.vue'
</script>

<template>
  <Container padding-top="0" :arrow="false">
    <About />
  </Container>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
