<script setup lang="ts">
import { MENU } from '~/constants/menu'

import menuIcon from '~/assets/icons/menu.svg?raw'
import closeIcon from '~/assets/icons/close.svg?raw'

const $route = useRoute()
const $router = useRouter()
const { isExpand } = useSidebar()
</script>

<template>
  <div
    class="menu"
    flex="~ items-center"
    cursor-pointer text-grey-9
  >
    <div v-html="isExpand ? closeIcon : menuIcon" />
    <q-menu
      v-model="isExpand"
      auto-close square :offset="[0, 14]"
      max-w="full!" w-full left="0!"
      py2 flex="~ col gap2" class="menu-bg"
      shadow-none
    >
      <div flex="~ col 1 gap2" h0>
        <div
          v-for="item of MENU"
          :key="item.to"
          class="menu-item"
          :class="{
            active: $route.path === item.to,
          }"
          subtitle-3
          flex="~ items-center gap2"
          p="y14px r4 l13px" cursor-pointer
          text-grey-6 b-l="3px transparent"
          @click="$router.push(item.to)"
        >
          <div
            truncate
            style="max-width: calc(100% - 28px);"
            v-text="item.label"
          />
        </div>
      </div>
    </q-menu>
  </div>
</template>

<style scoped lang="scss">
.menu {
  :deep(svg) {
    path {
      stroke: var(--grey-9);
    }
  }
}
</style>

<style lang="scss">
.menu-bg {
  background-color: var(--grey-2-a2) !important;
  backdrop-filter: blur(10px) !important;
  -webkit-backdrop-filter: blur(10px) !important;
  border: 1px solid var(--grey-3-a5) !important;

  .menu-item {
    color: var(--grey-9) !important;

    &:hover {
      background-color: var(--grey-3-a5) !important;
    }
  }
}
</style>
