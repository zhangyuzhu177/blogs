<script setup lang="ts">
</script>

<template>
  <div full flex="~ col center" overflow-auto>
    <Images w-full />
    <div
      xl="w-1080px" lg="w-800px" w-full
      h="100vh" border="1px gray-5" z-1
    >
      <slot />
    </div>
    <!-- <div relative full flex-center>
      <Test full absolute />
      <div
        xl="w-1080px" lg="w-800px" w-full
        h="100vh" border="1px gray-5" z-1
      >
        <slot />
      </div>
    </div> -->
  </div>
</template>

