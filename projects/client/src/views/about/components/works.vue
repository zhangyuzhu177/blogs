<script setup lang="ts">
import { isClient } from '@vueuse/core'
import type { IWorksConfigDto } from 'types'

defineProps<{ works: IWorksConfigDto[] }>()

function openWork(url?: string) {
  if (!isClient || !url)
    return
  window.open(url, '_blank')
}
</script>

<template>
  <div flex="~ col gap6">
    <div class="work-title" flex="~ center gap-2">
      <div w-1 h-1 b-rd-full bg="grey-9 dark:grey-1" />
      <div subtitle-1 text-center v-text="'个人作品'" />
      <div w-1 h-1 b-rd-full bg="grey-9 dark:grey-1" />
    </div>
    <div flex="~ col gap4" sm="flex-wrap flex-row">
      <div
        v-for="(work, index) in works" :key="work.id"
        class="work-card"
        :style="{ '--work-index': index }"
        flex="~ 1 gap2" b-rd-2 sm="p-4 max-w-[300px]"
        p-2 min-w-56 relative cursor-pointer select-none
        border="1 grey-3 dark:grey-7"
        bg="grey-1 dark:grey-9"
        @click="openWork(work.url)"
      >
        <q-img :src="work.icon" w-10 h-10 />
        <div>
          <div v-text="work.name" />
          <div text="grey-6" text-sm text-nowrap truncate v-text="work.desc" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.work-title {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: 0.75s;
}

.work-card {
  opacity: 0;
  animation: fadeInScale 0.6s ease-out forwards;
  animation-delay: calc(1s + var(--work-index) * 0.1s);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
