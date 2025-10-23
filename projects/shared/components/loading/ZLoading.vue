<script lang="ts" setup>
withDefaults(defineProps<{
  value?: boolean
  className?: string
}>(), {
  className: 'text-primary-2',
})
</script>

<template>
  <q-inner-loading
    v-if="value"
    :showing="value"
    :class="className"
    label="加载中..."
    z99999
  />
</template>
