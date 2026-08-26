<script setup lang="ts">
import type { IConfigDto, SysConfig } from 'types'
import localIcon from '~/assets/icons/local.svg?raw'

interface PersonInfoProps {
  info?: IConfigDto[SysConfig.ABOUT]
}

defineProps<PersonInfoProps>()

/** 默认头像 */
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
</script>

<template>
  <div flex="~ gap-6 col sm:gap4 sm:row justify-between" pt-4 pb-10 border-b border="grey-3 dark:grey-7">
    <div flex="~ col gap-4">
      <h1 v-text="info?.name" />
      <div text-18px style="--animation-order: 3;" v-text="info?.job" />
      <div style="--animation-order: 4;" v-text="info?.desc" />
      <div style="--animation-order: 2;" flex="~ items-center gap2">
        <div v-if="info?.github" flex="~ items-center gap1">
          <a :href="info?.github" target="_blank">
            <div size-5 i-bxl:github />
          </a>
        </div>
        <div v-if="info?.email" flex="~ items-center gap1">
          <a :href="`mailto:${info?.email}`" target="_blank">
            <div size-5 i-mingcute:mail-fill />
          </a>
        </div>
      </div>
    </div>
    <div flex="~ col gap-4 justify-end items-end">
      <div flex="~ col gap-4">
        <q-img
          w-40 h-40 rounded-5 overflow-hidden
          loading="lazy"
          :src="info?.avatar || defaultAvatar"
        />
        <div flex="~ gap-1 items-center">
          <div flex-center size-5 v-html="localIcon" />
          <div text-sm v-text="info?.location" />
        </div>
      </div>
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

.animate-item {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: calc(var(--animation-order) * 0.15s);
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
