<script setup lang="ts">
import { QScrollArea } from 'quasar'

const { scrollEl } = useClientApp()
const $route = useRoute()

const header = ref<HTMLElement>()
const footer = ref<HTMLElement>()

const { height: headerHeight } = useElementSize(header)
const { height: footerHeight } = useElementSize(footer)

/** 跳转路由滚动页面到顶部 */
watch(
  () => $route.path,
  () => {
    scrollEl.value?.setScrollPosition('vertical', 0)
  },
)
</script>

<template>
  <div class="flex flex-col full" bg="grey-1 dark:grey-9">
    <header ref="header" z-999>
      <AppHeader />
    </header>

    <QScrollArea
      ref="scrollEl"
      class="disable-horizontal-scroll "
      flex-1
    >
      <RouterView
        relative
        :style="`min-height: calc(100vh - ${headerHeight}px - ${footerHeight}px)`"
      />
      <footer ref="footer">
        <AppFooter />
      </footer>
    </QScrollArea>
  </div>
</template>
