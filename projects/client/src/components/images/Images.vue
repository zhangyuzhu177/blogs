<script setup lang="ts">
import { useClientApp } from '~/composables/app'
import defaultBg from '~/assets/defaultBg.jpg'

const route = useRoute()
const { scrollEl, page, getPageConfig } = useClientApp()

/** 滚动 */
function arrowDown() {
  scrollEl.value?.setScrollPosition(
    'vertical',
    document?.documentElement.clientHeight - 64,
    300,
  )
}

onMounted(async () => {
  await getPageConfig(route.path)
})
</script>

<template>
  <div relative>
    <div relative w-full h="100vh" overflow-hidden>
      <img full :src="page?.url ? page?.url : defaultBg">
    </div>
    <template v-if="page">
      <Title :page="page" />
    </template>
    <!-- <Waves /> -->
    <div class="arrow-down" bg="grey-1" w10 h10 i-ph:caret-double-down-bold @click="arrowDown" />
  </div>
</template>

<style scoped lang="scss">
.arrow-down {
  position: absolute;
  bottom: 80px;
  left: 49%;
  -webkit-animation: arrow-shake 1.5s ease-out infinite;
  animation: arrow-shake 1.5s ease-out infinite;
  cursor: pointer;
}

@keyframes arrow-shake {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  30% {
    opacity: 0.5;
    transform: translateY(25px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
