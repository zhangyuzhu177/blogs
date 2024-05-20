<script setup lang="ts">
const { width } = useWindowSize()
const { baseWidth, isExpand, changeState } = useSidebar()
</script>

<template>
  <div flex full>
    <AppSidebar z-999 />
    <div
      :class="
        width >= baseWidth
          ? 'flex-1 w0'
          : 'absolute inset-0 left-20'
      "
      flex="~ col" bg-grey-1
    >
      <AppHeader />
      <RouterView
        class="flex-1 h0 reactive-padding"
      />
    </div>
    <div
      v-if="width < baseWidth && isExpand"
      bg="black/40" flex-1 w0 z-999
      @click="() => changeState()"
    />
  </div>
</template>
