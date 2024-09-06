<script setup lang="ts">
import img from '~/assets/defaultBg.jpg'
</script>

<template>
  <div flex="~ col gap-4" lg="gap-6" style="">
    <div
      relative p-2 pt-19
      flex="~ col gap-4 items-center"
    >
      <div
        absolute-x-center top--15
        w-30 h-30 cursor-pointer
      >
        <img class="avatar" b-rd="50%" full :src="img">
      </div>
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
      <div>
        <pre>欲买桂花同载酒，终不似，少年游。</pre>
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
