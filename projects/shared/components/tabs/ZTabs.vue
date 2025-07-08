<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import type { QTabProps, QTabsProps } from 'quasar'

export interface ZTabsProps {
  /**
   * 选项卡绑定的值
   */
  modelValue?: QTabsProps['modelValue']
  /**
   * 选项卡的可用项
   *
   * 继承自 `quasar` 的 `QTabProps`
   */
  options?: QTabProps[]
  /**
   * 是否隐藏箭头
   */
  hideArrow?: boolean
  /**
   * 其他参数
   *
   * 继承自 `quasar` 的 `QTabsProps`
   */
  params?: Omit<QTabsProps, 'modelValue'>
}

const props = defineProps<ZTabsProps>()
defineEmits<{
  /**
   * 更新选项卡绑定的值
   */
  'update:modelValue': [ZTabsProps['modelValue']]
}>()

const value = useVModel(props, 'modelValue')
</script>

<template>
  <q-tabs
    v-model="value"
    class="z-tabs"
    :class="{ 'hide-arrow': hideArrow }"
    narrow-indicator
    b="1 grey-3 dark:grey-7" p-1 b-rd-2
    v-bind="props.params"
  >
    <q-tab
      v-for="item in options"
      :key="item.name"
      no-caps :ripple="false"
      opacity100
      v-bind="item"
    />
  </q-tabs>
</template>

<style lang="scss">
.z-tabs {
  width: fit-content;
  background-color: var(--grey-2);

  .q-tabs__content {
    gap: 12px;
    justify-content: normal !important;
    border-radius: unset;

    .q-tab {
      padding: 0;
      min-height: auto;

      .q-focus-helper {
        display: none;
      }

      .q-tab__content {
        position: relative;
        z-index: 9;
        padding: 4px 12px;
        color: var(--grey-6);
        // background-color: red;
        border-radius: 8px;
        min-width: auto;

        .q-tab__label {
          font-size: 16px;
          line-height: 24px;
          font-weight: 500;
        }
      }

      .q-tab__indicator {
        position: absolute;
        z-index: -1;
        inset: 0;
        height: 100%;
        border-radius: 8px;
        background-color: var(--grey-3);
      }

      &:hover,
      &.q-tab--active {
        .q-tab__content {
          color: var(--grey-9);
          background-color: var(--grey-3);
        }
      }
    }
  }

  // .q-tabs__content {
  //   gap: 12px;
  //   justify-content: normal !important;

  //   @media (min-width: 600px) {
  //     gap: 16px;
  //   }

  //   @media (min-width: 960px) {
  //     gap: 32px;
  //   }

  //   .q-tab {
  //     padding: 0;
  //     min-height: 40px;

  //     .q-focus-helper {
  //       display: none;
  //     }

  //     .q-tab__content {
  //       color: var(--grey-6);
  //       min-width: auto;

  //       .q-tab__label {
  //         font-size: 14px;
  //         line-height: 20px;
  //         font-weight: 500;

  //         @media (min-width: 600px) {
  //           font-size: 16px;
  //           line-height: 24px;
  //           font-weight: 600;
  //         }
  //       }

  //       .q-tab__indicator {
  //         height: 3px;
  //         background-color: var(--primary-1);
  //       }
  //     }

  //     &:hover,
  //     &.q-tab--active {
  //       .q-tab__content {
  //         color: var(--grey-9);
  //       }
  //     }
  //   }
  // }

  .q-tabs__arrow {
    font-size: 16px;
    color: var(--grey-6);
    min-width: auto;
    width: 16px;

    @media (min-width: 960px) {
      width: 32px;
    }

    &.q-tabs__arrow--left {
      transform: translateX(-100%);
    }

    &.q-tabs__arrow--right {
      transform: translateX(100%);
    }
  }

  &.hide-arrow {
    .q-tabs__arrow {
      display: none;
    }
  }

  &.start-item {
    .q-tab {
      flex: none;
    }
  }
}
</style>
