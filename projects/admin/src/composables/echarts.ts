// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'

// 引入图表，图表后缀都为 Chart
import {
  BarChart,
} from 'echarts/charts'

// 引入直角坐标系、图例、提示框等组件，组件后缀都为 Component
import {
  DataZoomComponent,
  GridComponent,
  LegendComponent,
  PolarComponent,
  TitleComponent,
  TooltipComponent,
} from 'echarts/components'

// 引入标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'

// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers'

import type { ECharts } from 'echarts/core'
import { ECHARTS_COLOR } from '~/constants/echarts'

// 注册必须的组件
echarts.use([
  // charts
  BarChart,

  // components
  GridComponent,
  LegendComponent,
  TooltipComponent,
  DataZoomComponent,
  TitleComponent,
  PolarComponent,

  // features
  LabelLayout,
  UniversalTransition,

  // renderer
  CanvasRenderer,
])

// 注册主题
echarts.registerTheme(
  'default',
  {
    color: ECHARTS_COLOR,
  },
)

export function useECharts() {
  /** 记录当前组件中的实例，在组件销毁时自动调用 echarts.dispose() */
  const instanceList: Array<ECharts> = []

  onBeforeUnmount(() => {
    instanceList.forEach((instance) => {
      try {
        instance.dispose()
      }
      catch (_) {}
    })
  })

  function init(...args: Parameters<typeof echarts.init>) {
    const instance = echarts.init(...args)
    instanceList.push(instance)
    return instance
  }

  return {
    init,
  }
}
