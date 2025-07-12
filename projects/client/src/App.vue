<script setup lang="ts">
const { getVisitorId } = useVisitor()

onBeforeMount(getVisitorId)
</script>

<template>
  <RouterView full />
</template>
