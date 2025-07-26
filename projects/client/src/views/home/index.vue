<script setup lang="ts">
import { SysConfig } from 'types'
import type { IConfigDto } from 'types'

// import { hyperspeedPresets } from '~/components/Art/Background/HyperspeedPresets'

// const effectOptions = ref(hyperspeedPresets.one)

/** 配置 */
const config = ref<IConfigDto[SysConfig.HOME]>()

onBeforeMount(async () => {
  const data = await getConfigApi(SysConfig.HOME) || {}
  config.value = data as IConfigDto[SysConfig.HOME]
})
</script>

<template>
  <div full flex="~ col center">
    <div w-full h-100vh relative>
      <Hyperspeed />
      <!-- <Aurora
        :particle-count="200"
        :particle-spread="10"
        :speed="0.1"
        :particle-colors="['#ffffff']"
        :move-particles-on-hover="false"
        :particle-hover-factor="1"
        :alpha-particles="false"
        :particle-base-size="100"
        :size-randomness="1"
        :camera-distance="20"
        :disable-rotation="false"
        class="w-full h-full"
      /> -->
      <!-- <div
        full overflow-hidden
        bg="cover center"
        style="height: calc(100vh);"
      >
        <q-img loading="lazy" full :src="config?.url" />
      </div> -->
      <div
        class="title" flex="~ col gap8 center"
        absolute inset-0 text="center" px-6
      >
        <div flex="~ col gap4 center">
          <SplitTitle
            v-if="config?.title"
            :text="config?.title"
            class-name="text-64px leading-72px font-semibold text-center"
          />
          <TextType
            v-if="config?.label"
            :text="config.label"
            :typing-speed="80"
            :pause-duration="1500"
            class-name="subtitle-1"
            cursor-character="_"
          />
        </div>
        <!-- <ArtButton text="查看更多" /> -->
      </div>
    </div>
    <SplashCursor />
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
.title {

.typed-cursor {
  opacity: 1;
  animation: blink 0.5s infinite;
}

@keyframes showup {
  0% {
    filter: blur(10px);
  }

  100% {
    letter-spacing: 10px;
    filter: blur(0.5px);
  }
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }

  100% {
    opacity: 1;
  }
}
}
</style>
