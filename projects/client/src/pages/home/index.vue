<script setup lang="ts">
import { SysConfig } from 'types'
import type { IConfigDto } from 'types'
import defaultBg from '~/assets/default.jpg'

const router = useRouter()

/** 配置 */
const config = ref<IConfigDto[SysConfig.HOME]>()

const signature = ref<string>('')
const time = ref<NodeJS.Timer | null>(null)

function appear(text: string) {
  signature.value = ''
  clearTimeout(time.value as NodeJS.Timeout)

  let speed = 80
  let count = 1
  function changeContent() {
    signature.value = text.substring(0, count)
    count++

    if (count !== text.length + 1) {
      speed -= 1
      if (speed < 5)
        speed = 5
      time.value = setTimeout(changeContent, speed)
    }
  }
  changeContent()
}

onBeforeMount(async () => {
  const data = await getConfigApi(SysConfig.HOME) || {}
  config.value = data as IConfigDto[SysConfig.HOME]
  if (config.value?.label)
    appear(config.value?.label as string)
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
      <div
        class="title" flex="~ col gap8 center"
        absolute inset-0 text="center" px-6
      >
        <div flex="~ col gap4 center">
          <h1 text-48px v-text="config?.title" />
          <h4 v-if="signature">
            <span v-text="signature" />
            <span class="typed-cursor">|</span>
          </h4>
        </div>
        <ArtButton text="查看文章" @click="router.push('/archives')" />
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
</style>

<style scoped lang="scss">
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

<route lang="yaml">
meta:
  layout: home
</route>
