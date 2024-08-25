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
  <div full flex="~ col center gap14">
    <Images :height :arrow w-full />
    <div
      xl="w-1200px" lg="px-6"
      px-4 w-full
    >
      <slot />
      <ScrollTop />
    </div>
  </div>
</template>
