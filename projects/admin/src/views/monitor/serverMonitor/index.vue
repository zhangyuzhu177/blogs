<script setup lang="ts">
import { formatFileSize } from 'utils'
import type { ECharts } from 'echarts/core'
import type { IServerMonitorReturnInfo } from 'types'
import ZEmpty from 'shared/components/empty/ZEmpty.vue'

import Card from './Card.vue'

const { init } = useECharts()

/**
 * 内存图表
 */
const memoryChartEl = ref<HTMLElement>()
let memoryInstance: ECharts | undefined

/**
 * 磁盘图表
 */
const diskChartEl = ref<HTMLElement>()
let diskInstance: ECharts | undefined

/** 加载中 */
const loading = ref(false)
/** 服务器信息 */
const serverInfo = ref<IServerMonitorReturnInfo>()

/**
 * 运行环境展示参数
 */
const operatingEnvironment = computed(() => {
  const { os, architecture, node } = serverInfo.value?.system || {}

  return [
    {
      label: '操作系统',
      value: os,
    },
    {
      label: '系统架构',
      value: architecture,
    },
    {
      label: 'Node 版本',
      value: node,
    },
  ]
})

/**
 * 内存展示参数
 */
const memory = computed(() => {
  const { total, used, available } = serverInfo.value?.memory || {}

  return [
    {
      label: '总内存',
      value: formatFileSize(total),
    },
    {
      label: '已用内存',
      value: formatFileSize(used),
    },
    {
      label: '可用内存',
      value: formatFileSize(available),
    },
  ]
})

/**
 * cpu 展示参数
 */
const cpu = computed(() => {
  const { model, cores } = serverInfo.value?.cpu || {}

  return [
    {
      label: 'CPU型号',
      value: model,
      width: '160px',
    },
    {
      label: '核心数',
      value: `${cores} 核`,
      width: '160px',
    },
  ]
})

/**
 * 磁盘展示参数
 */
const disk = computed(() => {
  const { total, used, available } = serverInfo.value?.disks || {}

  return [
    {
      label: '总空间',
      value: formatFileSize(total),
    },
    {
      label: '已用空间',
      value: formatFileSize(used),
    },
    {
      label: '可用空间',
      value: formatFileSize(available),
    },
  ]
})

/**
 * 获取服务器监控信息
 */
async function getSystemInfo() {
  loading.value = true
  try {
    serverInfo.value = await getServerMonitorInfoApi()
  }
  finally {
    loading.value = false
  }
}

/**
 * 初始化图表
 */
function initChart() {
  [memoryInstance, diskInstance].forEach((instance) => {
    instance?.setOption({
      legend: ECHARTS_LEGEND,
      tooltip: {
        ...ECHARTS_TOOLTIP,
        trigger: 'axis',
        formatter: (params: any) => {
          return `
          <div flex="~ gap4 items-center">
            <div>${params[0].marker} 使用率</div>
            <div>${params[0].value}%</div>
          </div>
        `
        },
      },
      grid: ECHARTS_GRID,
      dataZoom: ECHARTS_DATA_ZOOM,
      series: [],
    })
  })
}

/**
 * 渲染图表
 */
function renderChart() {
  if (!serverInfo.value || !memoryChartEl.value)
    return

  const { memory, disks } = serverInfo.value;

  [memoryInstance, diskInstance].forEach((instance, i) => {
    const value = i === 0 ? memory.usagePercent : disks.usagePercent
    instance?.setOption({
      title: [
        {
          text: `${value}%`, // 显示标题
          show: true, // 是否显示
          x: 'center', // x轴位置
          y: 'center', // y轴位置
        },
      ],
      polar: {
        center: ['50%', '50%'],
        radius: ['80%', '95%'],
      },
      angleAxis: {
        max: 100,
        startAngle: 90, // 开始的角度
        show: false,
      },
      radiusAxis: {
        type: 'category',
        show: true,
        axisLabel: {
          show: false, // 是否显示标签
        },
        axisLine: {
          show: false, // 是否显示轴线
        },
        axisTick: {
          show: false, // 是否显示刻度
        },
      },
      series: [
        {
          name: '',
          type: 'bar',
          roundCap: true,
          showBackground: true,
          data: [value],
          coordinateSystem: 'polar',
        },
      ],
    })
  })
}

watch(
  serverInfo,
  (newVal) => {
    if (newVal) {
      nextTick(() => {
        memoryInstance = init(memoryChartEl.value, 'default')
        diskInstance = init(diskChartEl.value, 'default')
        nextTick(initChart)
        renderChart()
      })
    }
  },
)

onBeforeMount(() => {
  getSystemInfo()
})
</script>

<template>
  <div full relative>
    <ZLoading :value="loading" />

    <div
      v-if="serverInfo"
      class="grid grid-cols-1 gap-6" md="grid-cols-2" text-sm
    >
      <!-- 运行环境 -->
      <Card title="运行环境" :items="operatingEnvironment" />

      <!-- 内存 -->
      <Card title="内存" :items="memory" is-chart>
        <template #chart>
          <div ref="memoryChartEl" flex-1 />
        </template>
      </Card>

      <!-- CPU -->
      <Card title="CPU" :items="cpu">
        <template #item>
          <div
            v-for="(item, index) in serverInfo?.cpu?.coresLoad" :key="item.core"
            :class="index === serverInfo?.cpu?.coresLoad.length - 1 ? '' : 'b-b-1 b-b-grey3'"
            :style="{
              borderTop: index === 0 ? '1px solid var(--grey-3)' : '',
            }"
            flex
          >
            <div
              flex="~ items-center" b-r="1 grey-3"
              px-3 py-2 bg-grey-2 w-40 flex-shrink-0
              v-text="`核心 ${item.core + 1} 负载`"
            />
            <div full flex-1 flex="~ center gap4" px-3 py-2>
              <q-linear-progress :value="item.usage / 100" class="z-progress" b-rd-2 h-2 />
              <div>{{ item.usage }}%</div>
            </div>
          </div>
        </template>
      </Card>

      <!-- 磁盘 -->
      <Card title="磁盘" :items="disk">
        <template #chart>
          <div ref="diskChartEl" flex-1 />
        </template>
      </Card>
    </div>

    <div v-else flex-center full>
      <ZEmpty label="暂无数据" />
    </div>
  </div>
</template>
