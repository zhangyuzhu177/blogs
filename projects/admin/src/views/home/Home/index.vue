<script setup lang="ts">
// import io from 'socket.io-client'

const onlineNumber = ref(0)
// const socket = io(`ws://${import.meta.env.VITE_PROXY_TARGET}`)

onMounted(() => {
  // 监听 'usersCount' 事件，并更新用户数
  // socket.on('usersCount', (count) => {
  //   onlineNumber.value = count
  // })
})
</script>

<template>
  <div class="">
    当前在线人数:{{ onlineNumber }}
  </div>
</template>

<style  scoped></style>
