<script setup lang="ts">
import { onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

// import { useWindowSize } from '@vueuse/core'
import { useSysConfig } from '../composables/app'
import { LEADING_PAGE_KEY } from '../constants/storage'
import CanvasBlobBg from '../components/canvas/index.vue'

const $router = useRouter()
// const { width } = useWindowSize()
const { app } = useSysConfig()

const leadingPage = localStorage?.getItem(LEADING_PAGE_KEY) ?? '/'

onBeforeUnmount(() => localStorage?.removeItem(LEADING_PAGE_KEY))
</script>

<template>
  <div
    text-grey-1
    absolute inset-0 flex="~ row"
  >
    <CanvasBlobBg full absolute left-0 right-0 />
    <div flex="1" w0 relative>
      <div
        flex="~ gap2 items-center"
        absolute top-8 left-8
        cursor-pointer min-w-113
        @click="$router.push(leadingPage)"
      >
        <h2 v-text="app?.name" />
      </div>
    </div>
    <div
      absolute-center px-10 flex-center w-full
      lg="max-w-160" xl="max-w-210"
    >
      <div
        class="auth-card" w140 px10 py6 backdrop-blur-md
        b="1px solid transparent" overflow-auto
      >
        <RouterView w-full text-sm font-500 />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.auth {
  background-image: url('../assets/bg/1.jpg');
  background-size: 100% 100%;
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;  /*关键*/
  background-position: center;
  // background: linear-gradient(90deg, #2F96FB 0%, #2041B7 100%);

  &-card {
    border-image: linear-gradient(150.02deg, #FFFFFF 0%, rgba(255, 255, 255, 0.05) 100%) 1;
    background: linear-gradient(147.03deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.01) 100%);
    max-height: calc(100% - 20px);

    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
