<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { QBtnToggleProps } from 'quasar'

interface ZBtnToggleProps {
  modelValue: any
  options: QBtnToggleProps['options']
  color?: string
  toggleColor?: string
  textColor?: string
  toggleTextColor?: string
  params?: Omit<
    QBtnToggleProps,
    'modelValue' | 'options' | 'color' | 'toggleColor'
    | 'textColor' | 'toggleTextColor'
  >
}

const props = withDefaults(defineProps<ZBtnToggleProps>(), {
  color: 'grey-2',
  toggleColor: 'primary-1',
  textColor: 'grey-8',
  toggleTextColor: 'grey-1',
})
defineEmits(['update:modelValue'])

const value = useVModel(props)
</script>

<template>
  <q-btn-toggle
    v-model="value"
    class="z-btn-toggle"
    :options="options"
    :color="color"
    :toggle-color="toggleColor"
    :text-color="textColor"
    :toggle-text-color="toggleTextColor"
    unelevated no-caps spread rounded-0
    padding="8px 48px"
    v-bind="params"
  />
</template>

<style lang="scss" scoped>
.q-btn-toggle {
  :deep(.q-btn) {
    font-size: 16px;
    line-height: 24px;
    font-weight: 600;
  }
}
</style>
