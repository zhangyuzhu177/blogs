<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import type { QCheckboxProps } from 'quasar'

export interface ZCheckboxProps {
  /**
   * 复选框绑定的值
   */
  modelValue?: QCheckboxProps['modelValue']
  /**
   * 当 `modelValue` 为 `Array` 时有效
   *
   * 告诉复选框在勾选/取消勾选时应该添加/删除哪个值
   */
  val?: QCheckboxProps['val']
  /**
   * 复选框 `label`
   *
   * 或使用默认插槽代替
   */
  label?: string
  /**
   * 是否禁用复选框
   */
  disable?: boolean
  /**
   * 是否切换不确定状态
   */
  toggleIndeterminate?: boolean
  /**
   * 其它参数
   *
   * 继承自 `quasar` 的 `QCheckboxProps`
   */
  params?: Omit<QCheckboxProps, 'modelValue' | 'val' | 'label' | 'disable' | 'toggleIndeterminate'>
}

const props = defineProps<ZCheckboxProps>()
defineEmits<{
  /**
   * 更新复选框绑定的值
   */
  'update:modelValue': [ZCheckboxProps['modelValue']]
}>()

const value = useVModel(props, 'modelValue')
</script>

<template>
  <q-checkbox
    v-model="value"
    class="z-checkbox"
    :val :label :disable
    :toggle-indeterminate
    select-none
    v-bind="props.params"
  >
    <slot />
  </q-checkbox>
</template>

<style lang="scss">
.q-checkbox.z-checkbox,
.z-table .q-checkbox {
  gap: 2px;

  .q-checkbox__inner {
    font-size: 24px;
    color: var(--grey-4);

    &::before {
      display: none;
    }

    .q-checkbox__bg {
      top: 12.5%;
      left: 12.5%;
      width: 75%;
      height: 75%;
      border-radius: 4px;
    }
  }

  .q-checkbox__label {
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: var(--grey-9);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:not(.disabled):hover {
    .q-checkbox__inner {
      color: var(--primary-1);
    }
  }

  &[aria-checked="true"],
  &[aria-checked="mixed"] {
    .q-checkbox__inner {
      color: var(--primary-1) !important;

      .q-checkbox__svg {
        width: 10px !important;
        height: 10px !important;
        top: 2px;
        left: 2px;
      }
    }
  }
}
</style>
