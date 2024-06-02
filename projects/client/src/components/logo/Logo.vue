<script setup lang="ts">
import * as echarts from 'echarts'

interface Props {
  title:string
}

const props=defineProps<Props>()

type EChartsOptions = echarts.EChartsOption
type ECharts = echarts.ECharts

const el = ref<HTMLDivElement | null>(null)
let instance: ECharts | null = null

function renderChart() {
  const option: EChartsOptions = {
    graphic: {
    elements: [
        {
          type: 'text',
          left: 'center',
          top: 'center',
          style: {
            text: props.title,
            fontSize: 30,
            lineDash: [0, 200],
            lineDashOffset: 0,
            fill: 'transparent',
            stroke: '#000',
            lineWidth: 1
          },
          keyframeAnimation: {
            duration: 3000,
            loop: false,
            keyframes: [
              {
                percent: 0.7,
                style: {
                  fill: 'transparent',
                  lineDashOffset: 200,
                  lineDash: [200, 0]
                }
              },
              {
                percent: 0.8,
                style: {
                  fill: 'transparent'
                }
              },
              {
                percent: 1,
                style: {
                  fill: 'black'
                }
              }
            ]
          }
        }
      ]
    }
  }
  instance?.setOption(option)
}

onMounted(() => {
  instance = echarts.init(el.value)
  renderChart()
})
</script>

<template>
  <div ref="el" full />
</template>
