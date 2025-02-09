<script lang="ts" setup>
import { ref } from 'vue'
import { objectPick } from 'utils'
import { useElementSize, useVModel } from '@vueuse/core'
import type { QSelectProps, QSelectSlots } from 'quasar'

import ZLabel from '../label/ZLabel.vue'
import type { ZLabelProps } from '../label/ZLabel.vue'

export interface ZSelectProps extends ZLabelProps {
  /**
   * 选择框绑定的值
   */
  modelValue?: QSelectProps['modelValue']
  /**
   * 过滤选项文本
   */
  filterText?: string
  /**
   * 选择框占位符
   */
  placeholder?: string
  /**
   * 选择框的可用选项
   */
  options?: QSelectProps['options']
  /**
   * 包含 `value` 选项的属性
   */
  optionValue?: QSelectProps['optionValue']
  /**
   * 包含 `label` 选项的属性
   */
  optionLabel?: QSelectProps['optionLabel']
  /**
   * 使用所选选项的值而不是整个选项更新 `modelValue`
   *
   * 默认值：`true`
   */
  emitValue?: QSelectProps['emitValue']
  /**
   * 尝试从 `options` 数组映射 `modelValue` 的 `label`
   *
   * 默认值：`true`
   */
  mapOptions?: QSelectProps['mapOptions']
  /**
   * `label` 所在的位置
   *
   * 可选值：`left`、`top`
   *
   * 默认值：`top`
   */
  labelPosition?: 'left' | 'top'
  /**
   * `label` 的宽度，仅当 `labelPosition` 为 `left` 时有效
   *
   * 单位：`px`
   */
  labelWidth?: number
  /**
   * 选择框尺寸
   *
   * 可选值：`small`、`big`
   *
   * 默认值：`big`
   */
  size?: 'small' | 'big'
  /**
   * 选择字段的校验规则
   */
  rules?: QSelectProps['rules']
  /**
   * 是否禁用选择框
   */
  disable?: boolean
  /**
   * 是否只读选择框
   */
  readonly?: boolean
  /**
   * 清空选择框
   */
  clearable?: boolean
  /**
   * 是否启用输入过滤功能
   */
  isFilter?: boolean
  /**
   * 是否允许多选
   *
   * 当此参数为 `true` 时，`modelValue` 必须是一个数组
   */
  multiple?: QSelectProps['multiple']
  /**
   * 其他参数
   *
   * 继承自 `quasar` 的 `QSelectProps`
   */
  params?: Omit<
    QSelectProps,
    'modelValue' | 'options' | 'optionValue' | 'optionLabel'
    | 'label' | 'rules' | 'disable' | 'readonly' | 'multiple'
  >
}

const props = withDefaults(defineProps<ZSelectProps>(), {
  emitValue: true,
  mapOptions: true,
  labelPosition: 'top',
  size: 'big',
})
defineEmits<{
  /**
   * 更新选择框绑定的值
   */
  'update:modelValue': [ZSelectProps['modelValue']]
  /**
   * 更新过滤选项文本
   */
  'update:filterText': [ZSelectProps['filterText']]
}>()

const selectRef = ref<HTMLElement>()

const value = useVModel(props, 'modelValue')
const text = useVModel(props, 'filterText')
const { width } = useElementSize(selectRef)
</script>

<template>
  <div
    class="z-select"
    flex="~ gap1"
    :style="{
      flexDirection: labelPosition === 'top' ? 'column' : 'row',
    }"
  >
    <ZLabel
      v-bind="{
        ...objectPick(props, 'label', 'required', 'aligned', 'explain'),
        colon: labelPosition === 'left',
      }"
      :style="{
        width: labelPosition === 'top' || !labelWidth ? 'auto' : `${labelWidth}px`,
        margin: labelPosition === 'top'
          ? '0'
          : size === 'big'
            ? '14px 0'
            : '8px 0',
      }"
    />
    <q-select
      ref="selectRef"
      v-model="value"
      :class="size"
      dense outlined
      color="primary-1"
      dropdown-icon="fas fa-chevron-down"
      popup-content-class="z-select-dropdown-menu"
      :popup-content-style="`width: ${width}px`"
      :menu-offset="[0, 8]"
      :options :option-value :option-label
      :rules :disable :readonly :clearable
      :emit-value :map-options :multiple
      :use-input="isFilter"
      :input-debounce="0"
      :style="{
        width: labelPosition === 'top' ? '100%' : '0',
        flex: labelPosition === 'top' ? 'auto' : '1',
      }"
      v-bind="props.params"
      @filter="(val, update) => update(() => text = val)"
      @blur="text = undefined"
    >
      <template
        v-for="(_, slotName) of ($slots as Readonly<QSelectSlots>)"
        :key="slotName"
        #[slotName]
      >
        <slot :name="slotName" />
      </template>

      <template
        v-if="multiple || ((!value || (Array.isArray(value) && !value.length)) && !text)"
        #selected
      >
        <!-- 多选，使用 chip -->
        <div
          v-if="multiple && Array.isArray(value) && value.length"
          h-full flex="~ items-center gap2"
          :style="{
            maxWidth: isFilter ? 'calc(100% - 58px)' : '100%',
          }"
        >
          <div
            rounded-1 p1 overflow-hidden
            flex="~ items-center gap1"
            bg-grey-2 subtitle-3
            cursor-auto
          >
            <div
              truncate
              v-text="
                !mapOptions
                  ? value[0]
                  : (typeof optionLabel === 'function'
                    ? optionLabel(value[0])
                    : value[0][optionLabel ?? 'label']) ?? value[0]
              "
            />
            <div
              v-if="!(readonly || disable)"
              size-18px bg-grey="5 hover:6"
              cursor-pointer flex-shrink-0
              rounded-full i-mingcute:close-circle-fill
              @click.prevent.stop="value.splice(0, 1)"
            />
          </div>
          <div
            v-if="value.length > 1"
            rounded-1 p1 bg-grey-2
            subtitle-3 cursor-auto
            flex-shrink-0
            v-text="`+ ${value.length - 1}`"
          />
        </div>

        <!-- 选择框占位符 -->
        <div
          v-else-if="!text"
          text-grey-5 font-400 text-sm
          absolute select-none
          v-text="placeholder"
        />

        <slot name="selected" />
      </template>
    </q-select>
  </div>
</template>

<style lang="scss">
.z-select {
  .q-field {
    .q-field__control {
      border-radius: 6px;
      background-color: var(--grey-1);

      &::before {
        border-color: var(--grey-3);
        border-style: solid;
      }

      &::after {
        border-width: 1px !important;
      }

      &:hover::before {
        border-color: var(--primary-1);
      }

      .q-field__native {
        color: var(--grey-9);
        font-size: 14px;
        line-height: 20px;
        gap: 8px;
        flex-wrap: nowrap;

        > span {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;

          &:empty {
            display: none;
          }
        }

        .q-field__input {
          min-height: 20px;
          padding: 0;
        }
      }

      .q-field__prepend {
        padding-right: 8px;
      }

      .q-field__append,
      .q-field__prepend {
        height: 100%;
        font-size: 16px;
        line-height: 24px;

        .q-select__dropdown-icon {
          margin-left: 4px;
          width: 20px;
          height: 20px;
          font-size: 12px;
          color: var(--grey-6);
        }

        .q-field__focusable-action {
          font-size: 14px;
          color: var(--grey-6);
          opacity: 0;
        }
      }
    }

    .q-field__bottom {
      padding: 6px 8px 0 0;
      font-size: 12px;
    }

    /** disabled */
    &.q-field--disabled {
      .q-field__control {
        background-color: var(--grey-2);

        > div {
          opacity: 1 !important;
        }

        .q-field__native {
          color: var(--grey-5);
        }
      }
    }

    &.big {
      .q-field__control {
        height: 48px;

        .q-field__native {
          padding: 14px 0;
        }
      }
    }

    &.small {
      &.q-field--with-bottom {
        padding-bottom: 16px;
      }

      .q-field__control {
        height: 36px;
        min-height: 36px;

        .q-field__native {
          padding: 8px 0;
          min-height: 36px;
        }
      }

      .q-field__bottom {
        padding: 3px 8px 0 0;
        min-height: 16px;
        font-size: 11px;
      }
    }

    &:hover {
      .q-field__control {
        .q-field__append {
          .q-field__focusable-action {
            opacity: 0.6;

            &:hover {
              opacity: 1;
            }
          }
        }
      }
    }
  }
}

.q-menu.z-select-dropdown-menu {
  box-shadow: 0px 5px 3px -2px #00000005, 0px 3px 2px -2px #0000000F;
  border-radius: 6px;
  border: 1px solid var(--grey-3);
  padding: 4px 0;
  color: var(--grey-9);
  font-size: 14px;
  line-height: 20px;
  font-weight: 400;
  z-index: 9001;

  .q-item {
    padding: 8px 12px;
    min-height: 36px;

    .q-focus-helper {
      display: none;
    }

    &.q-item--active {
      background-color: var(--grey-2);

      > .q-item__section {
        color: var(--grey-9);
        font-weight: 500;
      }
    }

    &:hover {
      background-color: var(--grey-2);
    }
  }
}
</style>
