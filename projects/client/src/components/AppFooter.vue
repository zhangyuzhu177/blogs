<script setup lang="ts">
interface Data {
  /** 总访问量 */
  total: number
  /** 今日访问量 */
  today: number
}

const data = ref<Data>()

onMounted(async () => {
  data.value = await getVisitCountApi()
})
</script>

<template>
  <footer
    flex="~ col center" subtitle-3
    text="grey-7 dark:grey-3" w-full
    b-t="1 grey-3 dark:grey-7"
  >
    <div flex="~ gap6" py-6 px-4>
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
    </div>
    <div w-25 h-1px bg="grey-3 dark:grey-7" />
    <div py-6 px-4>
      <a href="https://beian.miit.gov.cn" target="_blank">
        备案/许可证 鄂ICP备2024072756号-1
      </a>
    </div>
  </footer>
</template>
