<script setup lang="ts">
import Gallery from '~/views/gallery/gallery/index.vue'
import GalleryType from '~/views/gallery/galleryType/index.vue'

const { active, menu } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <Gallery v-if="menu[0].id === active" />
    <GalleryType v-else-if="menu[1].id === active" />
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
