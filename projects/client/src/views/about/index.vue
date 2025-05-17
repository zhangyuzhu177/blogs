<script setup lang="ts">
import { SysConfig } from 'types'
import type { IConfigDto } from 'types'

import Skill from './skill.vue'

/** 配置 */
const config = ref<IConfigDto[SysConfig.ABOUT]>()
/** 默认头像 */
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

onBeforeMount(async () => {
  const data = await getConfigApi(SysConfig.ABOUT)
  config.value = data as IConfigDto[SysConfig.ABOUT]
})
</script>

<template>
  <div v-if="config" flex="~ col gap6 sm:gap10" py-8>
    <!-- 基本信息 -->
    <div flex="~ col center gap2 sm:gap4">
      <div flex="~ justify-center">
        <q-img
          w-40 h-40 b-rd-full overflow-hidden
          shadow-2xl loading="lazy"
          :src="config?.avatar || defaultAvatar"
        />
      </div>
      <div max-w-150 flex="~ items-center col gap1">
        <h1 v-text="config?.name" />
        <div subtitle-2 flex="~ items-center gap2">
          <div
            v-if="config?.github"
            flex="~ items-center gap1"
            style="color:var(--grey-6)"
          >
            <a :href="config?.github" target="_blank">
              <div size-5 i-bxl:github />
            </a>
          </div>
          <div
            v-if="config?.email"
            flex="~ items-center gap1"
            style="color:var(--grey-6)"
          >
            <a :href="`mailto:${config?.email}`" target="_blank">
              <div size-5 i-mingcute:mail-fill />
            </a>
          </div>
          <div
            flex="~ items-center gap1"
            style="color:var(--grey-6)"
          >
            <div size-5 i-mingcute:location-line />
            <div v-text="config?.location" />
          </div>
        </div>
        <div style="color:var(--grey-6)" subtitle-2 v-text="config?.job" />
        <div style="color:var(--grey-6)" subtitle-3 text-center v-text="config?.desc" />
      </div>
    </div>
    <!-- 专业技能 -->
    <Skill :skills="config?.skills" />
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

:deep(.q-linear-progress__model--determinate) {
  background: var(--grey-9);
}
</style>
