<script setup lang="ts">
import { useClientApp } from '~/composables/app'

const { scrollEl } = useClientApp()

function arrowDown() {
  scrollEl.value?.setScrollPosition('vertical', document?.documentElement.clientHeight)
}
</script>

<template>
  <div full z-100 overflow-auto>
    <div relative>
      <Images />
      <Title />
      <Waves />
      <div>
        <div
          class="arrow-down"
          w10 h10 i-ph:caret-double-down-bold
          @click="arrowDown"
        />
      </div>
    </div>
    <div h="100vh" w-full>
      111
    </div>
  </div>
</template>

<route lang="yaml">
meta:
  layout: home
</route>

<style scoped lang="scss">
.arrow-down {
  position: absolute;
  bottom: 80px;
  left: 49%;
  -webkit-animation: arrow-shake 1.5s ease-out infinite;
  animation: arrow-shake 1.5s ease-out infinite;
  cursor: pointer;
  z-index: 999;
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
