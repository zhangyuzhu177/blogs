<script setup lang="ts">
interface Props {
  tag: {
    id: string
    label: string
  }
  active: string
}
defineProps<Props>()
</script>

<template>
  <div
    :class="active === tag.label ? 'active' : ''"
    px-2 py-1 bg="grey-2" b-rd-1 flex-center
    cursor-pointer hover:bg="grey-3"
    v-text="tag.label"
  />
</template>

<style  scoped lang="scss">
.active {
  color:var(--primary-1);
  background-color: var(--primary-1-bg);
}
</style>
