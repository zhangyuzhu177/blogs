<script setup lang="ts">
withDefaults(
  defineProps<{ disable?: boolean }>(),
  {
    disable: true,
  },
)
</script>

<template>
  <div
    flex="center gap2"
    text="sm grey-8" font-400
    select-none inline-flex
  >
    <div w-2 h-2 rounded-full :bg="disable ? 'alerts-error' : 'alerts-success'" />
    <div v-text="disable ? '禁用' : '启用'" />
  </div>
</template>

<style  scoped></style>
