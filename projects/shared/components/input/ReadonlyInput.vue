<script setup lang="ts">
import ZLabel from '../label/ZLabel.vue'
import type { ZLabelProps } from '../label/ZLabel.vue'
import { useSysConfig } from '../../composables/app'

export interface ReadonlyInputProps extends ZLabelProps {
  modelValue?: string | number
  labelPosition?: 'left' | 'top' | 'right'
  labelWidth?: number
}

const props = withDefaults(defineProps<ReadonlyInputProps>(), {
  labelPosition: 'top',
  labelWidth: 136,
})

const { isAdmin } = useSysConfig()
</script>

<template>
  <div
    flex="~ gap2"
    :items="labelPosition === 'top' ? 'stretch' : 'center'"
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
      }"
    />
    <div
      class="hide-scrollbar"
      p="y2 x3" b="1px grey-3" h12 flex="~ items-center"
      bg-grey-2 text="base grey-4" font-400
      overflow="x-auto y-hidden" whitespace-nowrap
      :rounded="isAdmin ? 2 : 0"
      :style="{
        width: labelPosition === 'top' ? '100%' : '0',
        flex: labelPosition === 'top' ? 'auto' : '1',
      }"
    >
      {{ modelValue }}
      <slot />
    </div>
  </div>
</template>
