<script lang="ts" setup>
defineProps<{
  value?: boolean
}>()
</script>

<template>
  <q-inner-loading
    v-if="value"
    :showing="value"
    label="加载中..."
    text-primary-2
    z9
  />
</template>
