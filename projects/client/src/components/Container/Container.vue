<script setup lang="ts">
interface Props {
  height?: string
  arrow?: boolean
}

withDefaults(defineProps<Props>(), {
  height: '600px',
  arrow: true,
})
</script>

<template>
  <div full flex="~ col center">
    <Images :height :arrow w-full />
    <div relative z-1 w-full py-16 flex="~ center">
      <div
        xl="w-1080px" lg="px-8" sm="px-6"
        px-4 full
      >
        <slot />
        <ScrollTop />
      </div>
      <ArtPlum />
    </div>
  </div>
</template>
