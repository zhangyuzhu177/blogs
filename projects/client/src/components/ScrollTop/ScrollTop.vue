<script setup lang="ts">
const { scrollEl } = useClientApp()

const show = ref(false)
nextTick(() => {
  const { y } = useScroll(document?.querySelector('.q-scrollarea__container') as HTMLElement)
  watch(
    () => y.value,
    (newVal) => {
      if (newVal > 400)
        show.value = true
      else
        show.value = false
    },
  )
})

function goToTop() {
  scrollEl.value?.setScrollPosition(
    'vertical',
    0,
    300,
  )
}
</script>

<template>
  <Transition name="slide-fade">
    <div
      v-if="show" fixed
      p2 w-10 h-10 flex-center text="grey-8"
      cursor-pointer shadow-md
      b-rd="50%" bottom-5 right-6
      @click="goToTop"
    >
      <div flex-center i-ph:rocket-bold />
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}
</style>
