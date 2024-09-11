<script setup lang="ts">
import io from 'socket.io-client'

const url = computed(() => {
  return `ws://${import.meta.env.VITE_SERVER_URL}`
})

const onlineNumber = ref(0)
const socket = io(url.value)

onMounted(() => {
  // 监听 'usersCount' 事件，并更新用户数
  socket.on('usersCount', (count) => {
    onlineNumber.value = count
  })
})
</script>

<template>
  <footer
    class="footer"
    flex="~ center"
    text-grey-5 py-8 px-4 w-full
  >
    <div>Footer</div>
    <div text-sm>
      -当前网站在线人数:{{ onlineNumber }}
    </div>
  </footer>
</template>

<style scoped lang="scss">
.footer {
  border-top: 1px solid var(--grey-3);
}
</style>
