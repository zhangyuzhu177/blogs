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
  <div flex="~ col center gap2 sm:gap4">
    <div flex="~ justify-center">
      <q-img
        class="avatar"
        w-40 h-40 b-rd-full overflow-hidden shadow-2xl
        cursor-pointer loading="lazy"
        :src="info?.avatar || defaultAvatar"
      />
    </div>
    <div max-w-150 flex="~ items-center col gap2" text="grey-7 dark:grey-4">
      <h1 text="grey-9 dark:grey-1" v-text="info?.name" />
      <div subtitle-2 flex="~ items-center gap2">
        <div
          v-if="info?.github"
          flex="~ items-center gap1"
        >
          <a :href="info?.github" target="_blank">
            <div size-5 i-bxl:github />
          </a>
        </div>
        <div
          v-if="info?.email"
          flex="~ items-center gap1"
        >
          <a :href="`mailto:${info?.email}`" target="_blank">
            <div size-5 i-mingcute:mail-fill />
          </a>
        </div>
        <div flex="~ items-center">
          <div flex-center size-5 v-html="localIcon" />
          <div v-text="info?.location" />
        </div>
      </div>
      <div subtitle-2 v-text="info?.job" />
      <div subtitle-3 text-center v-text="info?.desc" />
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
