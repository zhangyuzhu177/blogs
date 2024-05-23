<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import type { QSelectProps } from 'quasar'

import ZLabel from '../label/ZLabel.vue'
import type { ZLabelProps } from '../label/ZLabel.vue'
import { useSysConfig } from '../../composables/app'

export interface ZSelectProps extends ZLabelProps {
  modelValue: any
  options?: any[]
  placeholder?: string
  size?: 'small' | 'medium' | 'big'
  labelPosition?: 'left' | 'top' | 'right'
  labelWidth?: number
  params?: Omit<QSelectProps, 'modelValue' | 'options' | 'label' | 'placeholder' | 'dark'>
}

const props = withDefaults(defineProps<ZSelectProps>(), {
  password: false,
  size: 'big',
  labelPosition: 'top',
  labelWidth: 136,
})
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const { isAdmin } = useSysConfig()
</script>

<template>
  <div
    class="z-select"
    flex="~ gap2"
    :style="{
      flexDirection: labelPosition === 'top'
        ? 'column'
        : labelPosition === 'left'
          ? 'row'
          : 'row-reverse',
    }"
  >
    <ZLabel
      v-bind="props"
      :style="{
        width: labelPosition !== 'top' ? `${labelWidth}px` : '100%',
        marginTop: labelPosition !== 'top' ? (
          size === 'big' ? '14px' : (size === 'medium' ? '10px' : '6px')
        ) : '0',
      }"
    />
    <q-select
      v-model="value"
      :class="size + (isAdmin ? ' is-admin' : '')"
      dense outlined
      :options="options"
      :dark="dark"
      :color="dark ? 'grey-1' : 'primary-1'"
      dropdown-icon="fa fa-chevron-down"
      :popup-content-class="`z-select-dropdown-menu${isAdmin ? ' is-admin' : ''}`"
      :menu-offset="[0, 8]"
      :style="{
        width: labelPosition === 'top' ? '100%' : '0',
        flex: '1',
      }"
      v-bind="params"
    >
      <template v-if="placeholder && !value" #prepend>
        <div
          text-grey-5 font-400 opacity-70
          :text="size === 'small' || (size === 'medium' && isAdmin) ? 'sm' : 'base'"
          v-text="placeholder"
        />
      </template>
    </q-select>
  </div>
</template>

<style lang="scss">
.z-select {
  .q-field {
    .q-field__control {
      .q-field__prepend {
        position: absolute;
      }

      .q-field__append {
        .q-icon {
          width: 24px;
          font-size: 14px;
          color: var(--grey-4);

          &.fa-circle-xmark.q-field__focusable-action {
            font-size: 18px;
          }
        }
      }

      .q-field__native {
        min-height: auto;
        padding: 0;

        > span:first-child {
          white-space: nowrap;
          max-width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    &--dark {
      .q-field__append {
        .q-icon {
          color: var(--white-7) !important;
        }
      }
    }

    &.medium {
      .q-field__append {
        .q-icon.fa-circle-xmark.q-field__focusable-action {
          font-size: 16px;
        }
      }
    }

    &.small {
      .q-field__append {
        .q-icon.fa-circle-xmark.q-field__focusable-action {
          font-size: 15px;
        }
      }
    }
  }
}

.z-select-dropdown-menu {
  box-shadow: 0px 3px 6px -4px rgba(0, 0, 0, 0.12), 0px 6px 16px rgba(0, 0, 0, 0.08), 0px 9px 28px 8px rgba(0, 0, 0, 0.05) !important;
  border-radius: 0 !important;
  padding: 8px 0;
  color: var(--grey-8);

  .q-item {
    text-align: center;

    .q-focus-helper {
      opacity: 0.1 !important;
    }

    &:hover > .q-focus-helper {
      opacity: 0.1 !important;
    }
  }

  &.is-admin {
    box-shadow: 0px 0px 24px 0px #0C337314, 0px 0px 12px 0px #0C337314 !important;
    border-radius: 8px !important;
    border: 1px solid var(--grey-3);
    padding: 4px;

    .q-item {
      border-radius: 8px;
    }
  }
}
</style>
