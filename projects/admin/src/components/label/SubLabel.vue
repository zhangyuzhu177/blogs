<script lang="ts" setup>
defineProps<{
  label: string
}>()
</script>

<template>
  <div flex="~ items-center gap2" font-600>
    <div w1 h4 rounded-1 bg-primary-1 />
    {{ label }}
  </div>
</template>
