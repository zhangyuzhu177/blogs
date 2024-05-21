<script setup lang="ts">
import { IConfigDto } from 'shared/types/dto/config.interface';
import { SysConfig } from 'shared/types/enum/config.enum';

interface Props {
  page?: IConfigDto[SysConfig.HOME]
}

const props=defineProps<Props>()

const signature = ref<string>('hhhh')
const time = ref<NodeJS.Timer | null>(null)
const title = ref(props.page?.title||'Hello World')
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
  appear(props.page?.label||'Do not go gentle into the good night')
})
</script>

<template>
  <div class="title">
    <h1 class="artboard" v-text="title" />
    <h1 class="text">
      {{ signature }}
      <span class="typed-cursor">|</span>
    </h1>
  </div>
</template>

<style scoped lang="scss">
.title {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-50%) translateY(-60%);
  color: #ffffff;

  .artboard {
    font-family:
      "Fredericka the Great",
      Mulish,
      -apple-system,
      "PingFang SC",
      "Microsoft YaHei",
      sans-serif;
    font-size: 100px;
    line-height: 1.2;
    /* animation: titleScale 1s; */
    animation: showup 2s linear forwards;
    letter-spacing: -50px;
    text-align: center;
  }

  .text {
    font-size: 24px;
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
