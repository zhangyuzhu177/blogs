<script setup lang="ts">
import type { QTooltipProps } from 'quasar'

interface Props {
  title: string
  text?: string
  params?: QTooltipProps
}

const { title, text, params } = defineProps<Props>()

const { zoomRatio } = useSysConfig()

/** 提示框 */
const tooltip = ref(false)
</script>

<template>
  <div
    i-mingcute:information-line w5 h5 text-gray-4 cursor-pointer
    @click.stop="() => {
      if (zoomRatio < 1)
        tooltip = true
    }"
  >
    <q-tooltip v-if="zoomRatio >= 1" v-bind="params">
      <div v-if="text" v-text="text" />
      <slot />
    </q-tooltip>

    <ZDialog
      v-else
      v-model="tooltip"
      :title
      :params="{
        noBackdropDismiss: false,
      }"
    >
      <div v-if="text" text-sm v-text="text" />
      <slot />
    </ZDialog>
  </div>
</template>

<style  scoped></style>
