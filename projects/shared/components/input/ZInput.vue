<script lang="ts" setup>
import { objectPick } from 'utils'
import { computed, ref } from 'vue'
import type { QInputProps, QInputSlots } from 'quasar'

import ZLabel from '../label/ZLabel.vue'
import type { ZLabelProps } from '../label/ZLabel.vue'

export interface ZInputProps extends ZLabelProps {
  /**
   * 输入框绑定的值
   */
  modelValue?: QInputProps['modelValue']
  /**
   * 输入框占位符
   */
  placeholder?: string
  /**
   * 输入框类型
   *
   * 可选值：`text`、`password`、`textarea`、`number`
   *
   * 默认值：`text`
   */
  type?: 'text' | 'password' | 'textarea' | 'number'
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
   * 输入框尺寸
   *
   * 可选值：`small`、`big`、`super`
   *
   * 默认值：`big`
   */
  size?: 'small' | 'big' | 'super'
  /**
   * 输入字段的校验规则
   */
  rules?: QInputProps['rules']
  /**
   * `rules` 规则中的更改是否触发验证
   */
  reactiveRules?: QInputProps['reactiveRules']
  /**
   * 是否禁用输入框
   */
  disable?: boolean
  /**
   * 是否只读输入框
   */
  readonly?: boolean
  /**
   * 更新输入框绑定值时的防抖延迟时间（以毫秒为单位）
   */
  debounce?: QInputProps['debounce']
  /**
   * 指定输入框的最大长度
   */
  maxlength?: QInputProps['maxlength']
  /**
   * 是否开启自动计数
   */
  counter?: QInputProps['counter']
  /**
   * 最小值
   *
   * 仅当 `type` 为 `number` 时有效
   */
  min?: number
  /**
   * 最大值
   *
   * 仅当 `type` 为 `number` 时有效
   */
  max?: number
  /**
   * 保留小数的位数（0 ~ 100）
   *
   * 仅当 `type` 为 `number` 时有效
   */
  decimal?: number
  /**
   * 透明样式
   */
  dark?: boolean
  /**
   * 其他参数
   *
   * 继承自 `quasar` 的 `QInputProps`
   */
  params?: Omit<
    QInputProps,
    'modelValue' | 'label' | 'type' | 'rules' | 'reactiveRules'
    | 'disabled' | 'readonly' | 'debounce' | 'maxlength' | 'counter' | 'dark'
  >
}

const props = withDefaults(defineProps<ZInputProps>(), {
  type: 'text',
  labelPosition: 'top',
  size: 'big',
})
const emits = defineEmits<{
  /**
   * 更新输入框绑定的值
   */
  'update:modelValue': [ZInputProps['modelValue']]
}>()

const value = computed({
  get() {
    return props.modelValue
  },
  set(newVal) {
    const { type, min, max, decimal } = props
    if (type !== 'number') {
      emits('update:modelValue', newVal)
    }
    else {
      const num = Number(newVal)
      if (Number.isNaN(num) || (!newVal && typeof newVal !== 'number')) {
        emits('update:modelValue', undefined)
      }
      else {
        let res: number
        if (typeof min === 'number' && num < min)
          res = min
        else if (typeof max === 'number' && num > max)
          res = max
        else
          res = num
        if (typeof decimal === 'number' && decimal >= 0 && decimal <= 100)
          res = Number(res.toFixed(decimal))
        emits('update:modelValue', res)
      }
    }
  },
})

/**
 * 输入框类型是否为 `password`
 *
 * 仅当 `props.type` 为 `password` 时有效
 */
const isPwd = ref(true)

/**
 * 加减数值
 *
 * 仅当 `props.type` 为 `number` 时有效
 */
function valuePlusMinus(type: '+' | '-') {
  const num = Number(value.value)
  if (Number.isNaN(num))
    value.value = 0
  else if (type === '+')
    value.value = num + 1
  else if (type === '-')
    value.value = num - 1
}
</script>

<template>
  <div
    class="z-input"
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
        margin: labelPosition === 'top' ? '0'
          : size === 'super' ? '22px 0'
            : size === 'big' ? '14px 0'
              : '8px 0',
      }"
    />
    <q-input
      v-model="value"
      :class="`${size} ${dark ? '' : 'bright'}`"
      dense outlined
      :color="dark ? 'grey-1' : 'primary-1'"
      :placeholder :disable :readonly :debounce
      :rules :reactive-rules :maxlength dark
      :type="type === 'password' && !isPwd ? 'text' : type"
      :style="{
        width: labelPosition === 'top' ? '100%' : '0',
        flex: labelPosition === 'top' ? 'auto' : '1',
      }"
      v-bind="props.params"
    >
      <!-- 输入框插槽 -->
      <template
        v-for="(_, slotName) of ($slots as Readonly<QInputSlots>)"
        :key="slotName"
        #[slotName]
      >
        <slot :name="slotName" />
      </template>

      <template #append>
        <!-- 密码输入框控制器 -->
        <div
          v-if="type === 'password'"
          class="password-input-controller"
          :class="isPwd ? 'i-mingcute:eye-close-line' : 'i-mingcute:eye-2-line'"
          cursor-pointer ml1 :text="dark ? 'grey-1' : 'grey-6'"
          :size="size === 'super' ? 6 : 5"
          @click="isPwd = !isPwd"
        />

        <!-- 数字输入框控制器 -->
        <div
          v-else-if="type === 'number' && !disable && !readonly"
          class="number-input-controller"
          flex="~ col gap2px" opacity-0
          transition="opacity 100" ml1
        >
          <div
            class="__cursor-rect"
            rounded-2px cursor-default
            bg-grey-2 text-grey-6
            hover:bg-grey-3 active:bg-grey-4
            @click="valuePlusMinus('+')"
          >
            <div full i-material-symbols:arrow-drop-up-rounded />
          </div>
          <div
            class="__cursor-rect"
            rounded-2px cursor-default
            bg-grey-2 text-grey-6
            hover:bg-grey-3 active:bg-grey-4
            @click="valuePlusMinus('-')"
          >
            <div full i-material-symbols:arrow-drop-down-rounded />
          </div>
        </div>

        <slot name="append" />
      </template>

      <!-- 自动计数 -->
      <div
        v-if="counter"
        class="counter"
        flex="~ items-center"
        text="sm grey-6" pl2
      >
        <div v-text="(value ?? '').toString().length" />
        <div
          v-if="maxlength !== undefined"
          v-text="`/${maxlength}`"
        />
      </div>
    </q-input>
  </div>
</template>

<style lang="scss">
.z-input {
  .q-field {
    &.bright {
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

        input, textarea {
          color: var(--grey-9);
          font-size: 14px;
          line-height: 20px;

          &::-webkit-input-placeholder {
            color: var(--grey-5);
            opacity: 1;
            user-select: none;
          }
        }

        .q-field__append,
        .q-field__prepend {
          height: 100%;
          font-size: 16px;
          line-height: 24px;
        }

        .q-field__prepend {
          padding-right: 8px;
        }

        .q-field__append {
          padding-left: 8px;
        }
      }
    }

    .q-field__bottom {
      padding: 6px 8px 0 0;
      font-size: 12px;

      [role='alert'] {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    /** disabled */
    &.q-field--disabled {
      .q-field__control {
        background-color: var(--grey-2);

        .q-field__control-container {
          opacity: 1 !important;

          input, textarea {
            color: var(--grey-5);
          }
        }
      }
    }

    /** textarea */
    &.q-textarea {
      .q-field__control {
        padding-right: 0 !important;
        height: auto !important;

        .q-field__control-container {
          padding: 0;

          textarea {
            max-height: 300px;
            padding-right: 12px;
          }

          .counter {
            position: absolute;
            right: 12px;
            background-color: var(--grey-1);
          }
        }

        .q-field__append {
          display: none;
        }
      }
    }

    /** number */
    input[type="number"] {
      appearance: textfield;
      -moz-appearance: textfield;

      &::-webkit-inner-spin-button,
      &::-webkit-outer-spin-button {
        -webkit-appearance: none !important;
        margin: 0;
      }
    }
    &:hover {
      .number-input-controller {
        opacity: 1;
      }
    }

    &.super {
      .q-field__control {
        height: 64px;
        padding: 0 24px;
        border-radius: 8px;

        input, textarea {
          padding: 20px 0;
          font-size: 16px;
          line-height: 24px;
        }
      }

      textarea {
        min-height: 64px;
      }

      .number-input-controller {
        > div {
          width: 20px;
          height: 20px;
        }
      }

      &.q-textarea {
        .counter {
          bottom: 22px;
        }
      }
    }

    &.big {
      .q-field__control {
        height: 48px;

        input, textarea {
          padding: 14px 0;
        }
      }

      textarea {
        min-height: 48px;
      }

      .number-input-controller {
        > div {
          width: 16px;
          height: 16px;
        }
      }

      &.q-textarea {
        .counter {
          bottom: 14px;
        }
      }
    }

    &.small {
      &.q-field--with-bottom {
        padding-bottom: 16px;
      }

      .q-field__control {
        height: 36px;

        input, textarea {
          padding: 8px 0;
        }
      }

      .q-field__bottom {
        padding: 3px 8px 0 0;
        min-height: 16px;
        font-size: 11px;
      }

      textarea {
        min-height: 36px;
      }

      .number-input-controller {
        > div {
          width: 14px;
          height: 14px;
        }
      }

      &.q-textarea {
        .counter {
          bottom: 8px;
        }
      }
    }
  }
}
</style>
