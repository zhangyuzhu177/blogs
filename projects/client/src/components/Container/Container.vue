<script setup lang="ts">
import defaultBg from '~/assets/defaultBg.jpg'

interface Props {
  /** 图片高度 */
  height?: string
  /** 是否显示下拉肩头 */
  arrow?: boolean
  /** 标题 */
  title?: string
  /** 图片 */
  img?: string
}

const props = withDefaults(defineProps<Props>(), {
  height: '650px',
})

const route = useRoute()
const { scrollEl, page, getPageConfig } = useClientApp()
const el = ref<HTMLElement>()

/** 滚动 */
function arrowDown() {
  if (el.value) {
    scrollEl.value?.setScrollPosition(
      'vertical',
      el.value?.clientHeight - 40,
      300,
    )
  }
}

onBeforeMount(async () => {
  if (!props.title && !props.img)
    await getPageConfig(route.path.split('/')[1])
})
</script>

<template>
  <div full flex="~ col center">
    <div full relative>
      <div
        ref="el"
        full overflow-hidden
        bg="cover center"
        :style="{ height }"
      >
        <q-img full :src="page?.url || img || defaultBg" />
      </div>
      <template v-if="title">
        <div
          class="title" flex="~ col gap2 center"
          absolute inset-0 text="grey-1  center" px-6
        >
          <h1 v-text="title" />
        </div>
      </template>
      <template v-else-if="page">
        <Title :page="page" />
      </template>
      <div
        v-if="arrow"
        class="arrow-down" w10 h10 i-ph:caret-double-down-bold
        bg-grey-1
        @click="arrowDown"
      />
    </div>

    <div
      relative w-full py-16 flex="~ center"
    >
      <div
        xl="w-1240px" lg="px-8" sm="px-6"
        px-4 full
      >
        <slot />
        <ScrollTop />
      </div>
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

.arrow-down {
  position: absolute;
  z-index: 999;
  bottom: 80px;
  left: 49%;
  -webkit-animation: arrow-shake 1.5s ease-out infinite;
  animation: arrow-shake 1.5s ease-out infinite;
  cursor: pointer;
}

@keyframes arrow-shake {
  0% {
    opacity: 1;
    transform: translateY(0);
  }

  30% {
    opacity: 0.5;
    transform: translateY(25px);
  }

  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
