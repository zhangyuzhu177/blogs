<script setup lang="ts">
import { useClientApp } from '~/composables/app'
import defaultBg from '~/assets/defaultBg.jpg'

const route = useRoute()
const { scrollEl, page, getPageConfig } = useClientApp()

/**滚动 */
function arrowDown() {
  scrollEl.value?.setScrollPosition(
    'vertical',
    document?.documentElement.clientHeight
  )
}

onMounted(async () => {
  await getPageConfig(route.path)
})
</script>

<template>
  <div relative>
    <div relative w-full h="100vh" z-0 overflow-hidden>
      <img full :src="page?.url ? page?.url : defaultBg">
    </div>
    <Title :page="page" />
    <Waves />
    <div class="arrow-down" w10 h10 i-ph:caret-double-down-bold @click="arrowDown" />
  </div>
</template>

<style scoped></style>
