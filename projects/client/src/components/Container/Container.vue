<script setup lang="ts">
interface Props {
  height?: string
  arrow?: boolean
  paddingTop?: string
}

withDefaults(defineProps<Props>(), {
  height: '600px',
  arrow: true,
  paddingTop: '64px',
})
</script>

<template>
  <div full flex="~ col center">
    <Images :height :arrow w-full />
    <div
      relative z-1 w-full pb-16 flex="~ center"
      :style="{ paddingTop }"
    >
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
