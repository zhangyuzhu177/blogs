<script setup lang="ts">
import type { IConfigDto, SysConfig } from 'types'

interface Props {
  config: IConfigDto[SysConfig.HOME]
}

const props = defineProps<Props>()

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

onMounted(() => {
  if (props.config?.label)
    appear(props.config!.label as string)
})
</script>

<template>
  <div
    class="title" flex="~ col gap4 center"
    absolute inset-0 text="grey-1  center" px-6
  >
    <h1 text-48px v-text="props.config?.title" />
    <h4 v-if="signature">
      <span v-text="signature" />
      <span class="typed-cursor">|</span>
    </h4>
  </div>
</template>

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
