<script setup lang="ts">
import type { IConfigDto } from 'shared/types/dto/config.interface'
import type { SysConfig } from 'shared/types/enum/config.enum'

interface Props {
  page: IConfigDto[SysConfig.HOME]
}

const props = defineProps<Props>()

const signature = ref<string>('')
const time = ref<NodeJS.Timer | null>(null)
const title = ref(props.page?.title)
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
  appear(props.page!.label as string)
})
</script>

<template>
  <div class="title" flex="~ col gap2 items-center">
    <h1 v-if="title" class="artboard" v-text="title" />
    <h3 v-if="signature" class="font-subtitle">
      {{ signature }}
      <span class="typed-cursor">|</span>
    </h3>
  </div>
</template>

<style scoped lang="scss">
.title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-60%);
  color: white;

  .artboard {
    font-family:
      "Fredericka the Great",
      Mulish,
      -apple-system,
      "PingFang SC",
      "Microsoft YaHei",
      sans-serif;
    font-size: 64px;
    line-height: 1.2;
    /* animation: titleScale 1s; */
    animation: showup 2s linear forwards;
    letter-spacing: -50px;
    text-align: center;
  }

  .typed-cursor {
    opacity: 1;
    animation: blink 0.7s infinite;
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
