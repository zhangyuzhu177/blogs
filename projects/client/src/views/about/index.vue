<script setup lang="ts">
import { SysConfig } from 'types'
import type { IConfigDto } from 'types'

import Skills from './components/skills.vue'
import Works from './components/works.vue'
import PersonInfo from './components/personInfo.vue'

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
    <!-- 文章数量 -->
    <!-- <Count /> -->
    <!-- 专业技能 -->
    <Skills v-if="config.skills?.length" :skills="config.skills" />
    <!-- 个人作品 -->
    <Works v-if="config.works?.length" :works="config.works" />
  </div>
</template>

<style scoped lang="scss">
:deep(.q-linear-progress__model--determinate) {
  background: var(--grey-9);
}
</style>
