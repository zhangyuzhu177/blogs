<script setup lang='ts'>
const { contentEl, el, artPlumInit } = useArtPlum()

onMounted(async () => {
  setTimeout(artPlumInit, 1000)
})
const mask = computed(() => 'radial-gradient(circle, transparent, black);')
</script>

<template>
  <div
    ref="contentEl"
    class="absolute top-0 bottom-0 left-0 right-0 pointer-events-none print:hidden" style="z-index: -1"
    :style="`mask-image: ${mask};--webkit-mask-image: ${mask};`"
  >
    <canvas ref="el" width="400" height="400" />
  </div>
</template>
