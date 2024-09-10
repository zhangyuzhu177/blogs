<script setup lang="ts">
import { SysConfig } from 'shared/types/enum'

import AppSetting from './AppSetting.vue'
import PageSetting from './PageSetting.vue'
import AboutSetting from './AboutSetting.vue'

const { PAGE_NAV, active } = usePageAdmin()
</script>

<template>
  <div full flex="~ gap4">
    <q-card p-4 w-60 h-full min-w-50 flex="~ col gap2">
      <div v-for="item in PAGE_NAV" :key="item.id">
        <div
          :class="item.id === active ? 'active' : ''"
          flex-1 px-4 py-2 b-rd-2 cursor-pointer
          @click="active = item.id" v-text="item.label"
        />
      </div>
    </q-card>
    <q-card p-4 flex-1 h-full overflow-auto>
      <AppSetting v-if="active === SysConfig.APP" />
      <template v-for="item in PAGE_NAV.slice(1, 3)" :key="item.id">
        <PageSetting
          v-if="active === item.id"
          :data="item"
        />
      </template>
      <AboutSetting v-if="active === SysConfig.ABOUT" />
    </q-card>
  </div>
</template>

<style scoped lang="scss">
.active {
  background-color: var(--primary-1-bg);
  color: var(--primary-1);
}
</style>
