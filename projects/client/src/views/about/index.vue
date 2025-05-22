<script setup lang="ts">
import { SysConfig } from 'types'
import type { IConfigDto } from 'types'

import Skill from './skill.vue'
import PersonInfo from './personInfo.vue'

/** 配置 */
const config = ref<IConfigDto[SysConfig.ABOUT]>()

onBeforeMount(async () => {
  const data = await getConfigApi(SysConfig.ABOUT)
  config.value = data as IConfigDto[SysConfig.ABOUT]
})
</script>

<template>
  <div v-if="config" flex="~ col gap6 sm:gap10" py-8>
    <!-- 基本信息 -->
    <PersonInfo :info="config" />
    <!-- 专业技能 -->
    <Skill :skills="config?.skills" />
  </div>
</template>

<style scoped lang="scss">
:deep(.q-linear-progress__model--determinate) {
  background: var(--grey-9);
}
</style>
