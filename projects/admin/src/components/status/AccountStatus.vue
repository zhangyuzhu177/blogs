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
    <div w-2 h-2 rounded-full :bg="disable ? 'alerts-success' : 'alerts-error' " />
    <div v-text="disable ? '启用' : '禁用'" />
  </div>
</template>
