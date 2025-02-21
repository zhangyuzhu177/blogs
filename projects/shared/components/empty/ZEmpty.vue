<script lang="ts" setup>
import data from '../../assets/empty/data.svg?raw'
import denied from '../../assets/empty/denied.svg?raw'

interface ZEmptyProps {
  /**
   * 空状态图标
   *
   * 默认值：`denied`
   */
  icon?: keyof (typeof icons)
  /**
   * 空状态文本
   *
   * 或使用 `label` 插槽代替
   */
  label?: string
  /**
   * `label` 说明
   */
  explain?: string
}

withDefaults(defineProps<ZEmptyProps>(), {
  icon: 'denied',
})

const icons = {
  data,
  denied,
}
</script>

<template>
  <div
    class="z-empty"
    flex="~ col items-center gap12"
  >
    <div flex="~ col items-center gap6">
      <div rounded-full overflow-hidden v-html="icons[icon]" />
      <slot name="label">
        <div flex="~ col items-center gap2">
          <div
            v-if="label"
            subtitle-2 whitespace-pre-wrap
            text="grey-9 center"
            v-text="label"
          />
          <slot name="explain">
            <div
              v-if="explain"
              text="sm grey-6 center"
              v-text="explain"
            />
          </slot>
        </div>
      </slot>
    </div>
    <slot />
  </div>
</template>
