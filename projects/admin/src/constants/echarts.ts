import { format } from 'echarts/core'

/**
 * 主题色系
 */
export const ECHARTS_COLOR = [
  '#1879DD',
  '#51BA3B',
  '#F4822C',
  '#5EBDE8',
  '#7E5CDF',
  '#FABF3B',
  '#E44237',
  '#4CCDB8',
  '#F6639E',
  '#E0E060',
  '#59DA80',
]

/**
 * 图例
 */
export const ECHARTS_LEGEND = {
  type: 'scroll',
  itemGap: 16,
  itemWidth: 8,
  itemHeight: 8,
  icon: 'circle',
  textStyle: {
    color: '#1D2739',
    fontSize: 14,
  },
  inactiveColor: '#D0D5DD',
  formatter: (label: string) => format.truncateText(label, 200, '14px', '...'),
  tooltip: {
    show: true,
  },
  pageIcons: {
    horizontal: [
      'M8.293 12.707a1 1 0 0 1 0-1.414l5.657-5.657a1 1 0 1 1 1.414 1.414L10.414 12l4.95 4.95a1 1 0 0 1-1.414 1.414z',
      'M15.707 11.293a1 1 0 0 1 0 1.414l-5.657 5.657a1 1 0 1 1-1.414-1.414l4.95-4.95l-4.95-4.95a1 1 0 0 1 1.414-1.414z',
    ],
  },
  pageIconColor: '#667185',
  pageIconInactiveColor: '#D0D5DD',
  pageIconSize: [6, 12],
  pageTextStyle: {
    color: '#475367',
    fontSize: 14,
  },
}

/**
 * 提示框
 */
export const ECHARTS_TOOLTIP = {
  show: true,
  confine: true,
  appendToBody: true,
  className: 'basic-echarts-tooltip',
  textStyle: {
    color: '#1D2739',
  },
}

/**
 * 直角坐标系
 */
export const ECHARTS_GRID = {
  bottom: 6,
  left: 10,
  right: 34,
  containLabel: true,
}

/**
 * 数据区域缩放
 */
export const ECHARTS_DATA_ZOOM = {
  type: 'inside',
}

/**
 * X 坐标轴
 */
export const ECHARTS_X_AXIS = {
  type: 'category',
  name: '日期',
  nameGap: 8,
  nameTextStyle: {
    color: '#475367',
  },
  axisLine: {
    lineStyle: {
      color: '#E4E7EC',
    },
  },
  axisLabel: {
    color: '#98A2B3',
  },
}

/**
 * Y 坐标轴
 */
export const ECHARTS_Y_AXIS = {
  type: 'value',
  axisLabel: {
    color: '#475367',
  },
  splitLine: {
    lineStyle: {
      color: '#E4E7EC',
      type: [4, 4],
    },
  },
}

/**
 * 饼图
 */
export const ECHARTS_PIE = {
  type: 'pie',
  radius: [60, 120],
  center: ['60%', '50%'],
  label: {
    show: false,
    position: 'center',
  },
  emphasis: {
    label: {
      show: true,
      fontSize: 24,
      fontWeight: 500,
    },
  },
  tooltip: {
    formatter: ({ marker, name, value, percent }: any) => {
      return `<div>
        <div>
          ${marker}
          <span>${name}</span>
          <span style="float: right; margin-left: 20px; font-weight: 900">${value}</span>
        </div>
        <div style="margin-top: 8px">
          <span>占比：</span>
          <span>${percent}%</span>
        </div>
      </div>`
    },
  },
}
