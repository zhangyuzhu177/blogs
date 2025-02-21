<script lang="ts" setup>
import ZInfo from '../info/ZInfo.vue'

export interface ZLabelProps {
  /**
   * `label`
   *
   * 或使用默认插槽代替
   */
  label?: string
  /**
   * 是否为必填项
  */
  required?: boolean
  /**
   * 当 `required` 为 `false` 时，`label` 是否对齐
  */
  aligned?: boolean
  /**
   * `label` 说明
   */
  explain?: string
  /**
   * 冒号
   */
  colon?: boolean
}

defineProps<ZLabelProps>()
</script>

<template>
  <div
    v-if="label"
    class="z-label" font-500 h5
    text="sm grey-9" flex="~ items-center"
  >
    <div flex="~ items-center gap1">
      <div
        v-if="required || aligned"
        text-alerts-error
        :style="{
          visibility: required ? 'visible' : 'hidden',
        }"
        v-text="'*'"
      />
      <slot>
        <div truncate v-text="label" />
      </slot>
      <ZInfo v-if="explain" :description="explain" />
    </div>
    <div v-if="colon" v-text="`：`" />
  </div>
</template>
