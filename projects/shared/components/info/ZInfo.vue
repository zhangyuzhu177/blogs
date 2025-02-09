<script lang="ts" setup>
import { computed } from 'vue'
import type { QTooltipProps } from 'quasar'

export interface ZInfoProps {
  /**
   * 图标
   *
   * 或通过 `icon` 插槽代替
   *
   * 可选值：`info` */
  icon?: 'info'
  /**
   * 描述信息
   *
   * 或通过默认插槽代替
   */
  description?: string
  /**
   * 设置悬浮提示框相对于其目标的起始位置或锚点的两个值
   *
   * 默认值：`top middle`
   */
  anchor?: QTooltipProps['anchor']
  /**
   * 设置悬浮提示框相对于其目标的位置的两个值
   *
   * 默认值：`bottom middle`
   */
  self?: QTooltipProps['self']
  /**
   * 由两个数字组成的数组，以像素为单位在水平和垂直方向上偏移悬浮提示框
   *
   * 默认值：`[0, 6]`
   */
  offset?: QTooltipProps['offset']
  /**
   * 悬浮提示框的最大宽度
   *
   * `CSS` 单位大小，包括单位名称
   *
   * 默认值：`50%`
   */
  maxWidth?: QTooltipProps['maxWidth']
  /**
   * 其它参数
   *
   * 继承自 `quasar` 的 `QTooltipProps`
   */
  params?: Omit<QTooltipProps, 'modelValue' | 'anchor' | 'self' | 'offset' | 'maxWidth'>
}

const props = withDefaults(defineProps<ZInfoProps>(), {
  icon: 'info',
  anchor: 'top middle',
  self: 'bottom middle',
  offset: () => [0, 6],
  maxWidth: '50%',
})

const icon = computed(() => ({
  info: 'i-mingcute:information-line',
}[props.icon]))
</script>

<template>
  <div
    class="z-info" text="md grey-6"
    rounded-full cursor-pointer
  >
    <slot name="icon">
      <div :class="icon" />
    </slot>
    <q-tooltip
      :anchor :self :offset :max-width
      v-bind="props.params"
    >
      <slot>
        <div v-text="description" />
      </slot>
    </q-tooltip>
  </div>
</template>
