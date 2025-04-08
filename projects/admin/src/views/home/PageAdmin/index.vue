<script setup lang="ts">
import { SysConfig } from 'types'

import HomeSetting from './HomeSetting.vue'
import AboutSetting from './AboutSetting.vue'

const { PAGE_NAV, active } = usePageAdmin()
</script>

<template>
  <div full flex="~ gap4" relative>
    <div
      b="1 grey-3" p-4 w-60 b-rd-2
      h-full min-w-50 flex="~ col gap2"
    >
      <div v-for="item in PAGE_NAV" :key="item.id">
        <div
          :class="item.id === active ? 'active' : ''"
          flex-1 px-4 py-2 b-rd-2 cursor-pointer
          @click="active = item.id" v-text="item.label"
        />
      </div>
    </div>
    <div flex-1 overflow-auto>
      <HomeSetting v-if="active === SysConfig.HOME" />
      <AboutSetting v-if="active === SysConfig.ABOUT" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.active {
  background-color: var(--primary-1-bg);
  color: var(--primary-1);
}
</style>
