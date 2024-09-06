<script setup lang="ts">
import img from '~/assets/defaultBg.jpg'
</script>

<template>
  <div flex="~ gap-4" lg="gap-6">
    <div flex="~  col gap-4 items-center" min-w-40 p-2>
      <img
        class="avatar" b-rd="50%"
        w-25 h-25 cursor-pointer
        :src="img"
      >
      <div flex="~ gap-4">
        <a href="tel:18727384722" target="_blank">
          <div transition-all hover:bg="grey-5" size-6 i-mingcute:phone-line />
        </a>
        <a href="mailto:zhangyuzhu0177@163.com" target="_blank">
          <div transition-all hover:bg="grey-5" size-6 i-mingcute:mail-line />
        </a>
        <a href="https://github.com/ZhangYuzhu1" target="_blank">
          <div transition-all hover:bg="grey-5" size-6 i-mingcute:github-line />
        </a>
      </div>
    </div>
    <div flex="~ 1.5">
      <h3>content</h3>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar {
  &:hover {
    transform: rotate(666turn);
    transition-delay: 1s;
    transition-property: transform;
    transition-duration: 59s;
    transition-timing-function: cubic-bezier(0.34, 0, 0.84, 1);
  }
}

:deep(.q-btn){
  .q-focus-helper {
    display: none;
  }

  .q-ripple {
    display: none;
  }

  .q-tab__indicator{
    display: none;
  }
}
</style>
