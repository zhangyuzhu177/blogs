<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import type { QRadioProps } from 'quasar'

interface ZRadioProps {
  modelValue?: QRadioProps['modelValue']
  val?: QRadioProps['val']
  label?: string
  disable?: boolean
  params?: Omit<QRadioProps, 'modelValue' | 'val' | 'label' | 'disable'>
}

const props = defineProps<ZRadioProps>()
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
</script>

<template>
  <q-radio
    v-model="value"
    class="z-radio"
    :val="val"
    :label="label"
    :disable="disable"
    checked-icon="fas fa-check"
    v-bind="params"
  >
    <slot />
  </q-radio>
</template>

<style lang="scss" scoped>
.z-radio {
  &[aria-checked="true"] {
    :deep(.q-radio__inner) {
      .q-radio__icon {
        background-color: currentColor;
        border-radius: 10px;
        font-size: 20px;
        position: relative;
        overflow: hidden;

        &::before {
          color: var(--grey-1);
          font-size: 12px;
        }

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          left: 20px;
          width: auto;
          background-color: currentColor;
          animation: radio .3s;
        }

        @keyframes radio {
          from {
            left: 0;
          }
          to {
            left: 20px;
          }
        }
      }
    }
  }

  :deep(.q-radio__inner) {
    font-size: 36px;
  }

  :deep(.q-radio__label) {
    font-size: 14px;
    line-height: 20px;
  }
}
</style>
