<script setup lang="ts">
// const url = computed(() => {
//   return `ws://${import.meta.env.VITE_SERVER_URL}`
// })

// const socket = io(url.value)

onMounted(() => {
  // 监听 'usersCount' 事件，并更新用户数
  // socket.on('usersCount', (count) => {
  //   onlineNumber.value = count
  // })
})
</script>

<template>
  <footer
    class="footer"
    flex="~ col gap-2 center" bg-transparent
    text-grey-5 py-6 px-4 w-full
  >
    <a
      text-sm
      href="https://beian.miit.gov.cn"
      target="_blank"
    >
      互联网ICP备案：鄂ICP备2024072756号-1
    </a>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  border-top: 1px solid var(--grey-3);
}
</style>
