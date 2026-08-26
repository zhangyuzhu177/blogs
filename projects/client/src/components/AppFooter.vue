<script setup lang="ts">
interface Data {
  /** 总访问量 */
  total: number
  /** 今日访问量 */
  today: number
}

const route = useRoute()

const data = ref<Data>()

onMounted(async () => {
  data.value = await getVisitCountApi()
})
</script>

<template>
  <footer
    v-if="route.meta.footer !== false"
    py-5 px-6
    flex="~ col center gap-4" subtitle-3 font-400
    text="grey-6 dark:grey-3" w-full
    b-t="1 grey-3 dark:grey-7"
  >
    <!-- <div flex="~ gap6" py-6 px-4>
      <div flex="~ col">
        <div text-sm>
          总访问量
        </div>
        <div text="lg grey-9 dark:grey-1" font-500 v-text="data?.total" />
      </div>
      <div flex="~ col">
        <div text-sm>
          今日访问
        </div>
        <div text="lg grey-9 dark:grey-1" font-500 v-text="data?.today" />
      </div>
    </div> -->
    <div>
      保持好奇，慢慢生活。
    </div>
    <div w-25 h-1px bg="grey-3 dark:grey-7" />
    <div flex gap-2 text-12px>
      <a href="https://beian.miit.gov.cn" target="_blank">
        浙ICP备2025193081号
      </a>
      <div>
        |
      </div>
      <div>©2026 zyz</div>
    </div>
  </footer>
</template>
