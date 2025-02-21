<script lang="ts" setup>
import * as PIXI from 'pixi.js'
import { nextTick, onMounted, ref } from 'vue'
import { KawaseBlurFilter } from '@pixi/filter-kawase-blur'

import { isClient } from '@vueuse/core'
import { Orb } from './Orb'
import { ColorPalette } from './ColorPalette'

// interface Props {}
// withDefaults(defineProps<Props>(), {});

const orbCanvas = ref<HTMLCanvasElement>()
const container = ref<HTMLDivElement>()
const hue = ref(180)

async function renderOrb() {
  if (!isClient)
    return

  // Create PixiJS app
  const app = new PIXI.Application({
    // render to <canvas class="orb-canvas"></canvas>
    view: orbCanvas.value,
    // auto adjust size to fit
    resizeTo: container.value,
    // transparent background, we will be creating a gradient background later using CSS
    backgroundAlpha: 0,
  })
  app.stage.filters = [new KawaseBlurFilter(30, 10, true)]

  // Create colour palette
  const colorPalette = new ColorPalette()
  hue.value = colorPalette.hue

  // Create orbs
  const orbs: Array<Orb> = []

  for (let i = 0; i < 10; i++) {
    const orb = new Orb(colorPalette.randomColor())

    app.stage.addChild(orb.graphics)

    orbs.push(orb)
  }

  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    app.ticker.add(() => {
      orbs.forEach((orb) => {
        orb.update()
        orb.render()
      })
    })
  }
  else {
    orbs.forEach((orb) => {
      orb.update()
      orb.render()
    })
  }
}

onMounted(() => {
  nextTick(() => {
    renderOrb()
  })
})
</script>

<template>
  <div
    ref="container" class="orb-canvas"
    :style="{ background: `linear-gradient(hsl(${hue},${80}%,${90}%), hsl(${hue},${100}%,${80}%))` }"
  >
    <canvas ref="orbCanvas" w="100%!" h="100%!" absolute left-0 top-0 />
    <div class="noise" absolute left-0 top-0 full />
  </div>
</template>

<style lang="scss" scoped>
.noise {
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1024 1024' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.25' numOctaves='1' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  background-repeat: repeat;
  background-size: 250px 250px;
  opacity: 0.6;
}
</style>
