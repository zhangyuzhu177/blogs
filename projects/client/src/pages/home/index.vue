<script setup lang="ts">
import { SysConfig } from 'types'
import type { IConfigDto } from 'types'
import defaultBg from '~/assets/default.jpg'

/** 配置 */
const config = ref<IConfigDto[SysConfig.HOME]>()

onBeforeMount(async () => {
  const data = await getConfigApi(SysConfig.HOME) || {}
  config.value = data as IConfigDto[SysConfig.HOME]
})
</script>

<template>
  <div full flex="~ col center">
    <div full relative>
      <div
        full overflow-hidden
        bg="cover center"
        style="height: calc(100vh);"
      >
        <q-img loading="lazy" full :src="config?.url || defaultBg" />
      </div>
      <Title v-if="config" :config />
    </div>
  </div>
</template>

<style scoped lang="scss">
:deep(.q-img) {
  .q-img__container{
    background-size: cover;
    background-position: center;
    .q-img__image {
      object-fit: cover !important;
    }
  }
}
</style>

<route lang="yaml">
meta:
  layout: home
</route>
