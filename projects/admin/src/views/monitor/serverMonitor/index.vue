<script setup lang="ts">
import type { ECharts } from 'echarts/core'

const { init } = useECharts()

const chartEl = ref<HTMLElement>()
let instance: ECharts | undefined

/**
 * 渲染图表
 */
function renderChart() {
  instance?.setOption({
    grid: {
      bottom: 0,
      left: 0,
      right: 0,
      top: 0,
      containLabel: false,
    },
    xAxis: {
      type: 'category',
      show: false,
    },
    yAxis: {
      type: 'value',
      show: false,
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        lineStyle: {
          color: '#1a73e8',
          width: 2,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(26, 115, 232, 0.1)', // 顶部浅蓝色
              },
              {
                offset: 1,
                color: 'rgba(26, 115, 232, 0)', // 底部透明
              },
            ],
          },
        },
        data: [150, 160, 155, 165, 150, 230, 210, 220, 180, 150, 140],
      },
    ],
  })
}

onMounted(() => {
  instance = init(chartEl.value, 'default')
  nextTick(() => {
    renderChart()
  })
})
</script>

<template>
  <div class="flex bg-grey-2 p-4">
    <div class="flex gap-2 p-2 rounded-lg bg-grey-1">
      <div class="flex gap-2 text-nowrap flex-col justify-between">
        <div font-600>
          平均出样周期
        </div>
        <div text-sm>
          <span text-black text-xl font-600>13</span>
          天
        </div>
        <div text-sm>
          15天内出样占比：80%
        </div>
      </div>
      <div ref="chartEl" class="w-50" />
    </div>
  </div>
</template>
