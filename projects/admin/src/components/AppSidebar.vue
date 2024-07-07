<script setup lang="ts">
import left from '~/assets/icons/ident/left.svg?raw'
import right from '~/assets/icons/ident/right.svg?raw'

const { width } = useWindowSize()
const { baseWidth, isExpand, isShow, time, changeState } = useSidebar()
const { app } = useSysConfig()

/** 退出登录对话框 */
const logoutDialog = ref(false)

watch(
  width,
  (newVal, oldVal) => {
    if ((!oldVal || oldVal >= baseWidth) && newVal < baseWidth)
      changeState(false)
    else if ((!oldVal || oldVal < baseWidth) && newVal >= baseWidth)
      changeState(true)
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <div
    flex="~ col gap2" bg="#282C34" py-6
    text-grey-1 :max-w="isExpand ? 80 : 20" :style="{
      transition: `max-width ${time}ms`,
    }"
  >
    <div flex="~ col gap2">
      <div flex="~ center col gap2" px-4>
        <img b-rd-10 w-10 h-10 :src="app?.icon">
        <h4
          v-if="isShow"
          truncate
          cursor-pointer
          v-text="app?.name"
        />
      </div>
      <div flex="~ items-center">
        <div v-if="isShow" h1px flex-1 bg-white-2 />
        <div
          class="unpack" :mx="isShow ? 4 : 'auto'" cursor-pointer @click="changeState()"
          v-html="isExpand ? left : right"
        />
      </div>
    </div>
    <div w-full flex="~ 1 col gap6" px4 flex-1 h0>
      <HomeMenu flex-1 h0 class="hide-scrollbar" />
      <MenuItem
        label="退出登录"
        icon="exit"
        @click="logoutDialog = true"
      />
    </div>

    <!-- 退出登录对话框 -->
    <LogoutDialog v-model="logoutDialog" />
  </div>
</template>
