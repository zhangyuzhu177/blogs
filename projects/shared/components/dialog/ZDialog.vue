<script lang="ts" setup>
import { ref } from 'vue'
import { QScrollArea } from 'quasar'
import { useVModel } from '@vueuse/core'
import type { QDialogProps } from 'quasar'

import ZBtn from '../btn/ZBtn.vue'
import ZLoading from '../loading/ZLoading.vue'
import { useSysConfig } from '../../composables/app'

interface ZDialogProps {
  modelValue?: boolean
  /**
   * 对话框标题
   *
   * 或使用 `title` 插槽代替
   */
  title?: string
  caption?: string
  footer?: boolean
  disableConfirm?: boolean
  cancelText?: string
  confirmText?: string
  confirmClose?: boolean
  wrapperStyle?: Record<string, any>
  /** 是否使用滚动区域 */
  scroll?: boolean
  loading?: boolean
  params?: Omit<QDialogProps, 'modelValue'>
}

const props = withDefaults(defineProps<ZDialogProps>(), {
  cancelText: '取消',
  confirmText: '确认',
  confirmClose: true,
})
defineEmits(['update:modelValue', 'ok'])

const scrollRef = ref<InstanceType<typeof QScrollArea>>()

const { isAdmin } = useSysConfig()

const value = useVModel(props, 'modelValue')

defineExpose({
  scrollRef,
})
</script>

<template>
  <q-dialog
    v-model="value"
    no-backdrop-dismiss no-route-dismiss
    v-bind="params"
  >
    <q-card
      :rounded="isAdmin ? '3!' : '0!'" flex="~ col gap6" py6
      :style="{
        minWidth: '460px',
        height: scroll ? 'calc(100vh - 100px)' : 'auto',
        ...wrapperStyle,
      }"
    >
      <header flex="~ row justify-between items-center" px6>
        <div text="grey-8" flex="~ row items-center gap1">
          <div font-600 v-text="title" />
          <div text="sm grey-6" font-400 v-text="caption" />
        </div>

        <q-btn dense flat p0 h6 w6 min-h="auto!" @click="value = false">
          <div i-mingcute:close-line text-grey-5 text-lg />
        </q-btn>
      </header>

      <div v-if="scroll" flex="~ col 1" h0 b-y-1>
        <QScrollArea ref="scrollRef" class="z-dialog__scrollarea" full px6>
          <div py6>
            <slot />
          </div>
        </QScrollArea>
      </div>

      <div v-else px6 pb4>
        <slot />
      </div>

      <footer v-if="footer" flex="~ row justify-end gap6" px6>
        <ZBtn
          min-w-28
          :label="cancelText"
          text-color="primary-1"
          :params="{
            outline: true,
          }"
          @click="value = false"
        />
        <ZBtn
          min-w-28
          :label="confirmText"
          :disable="disableConfirm"
          @click="() => {
            value = false
            $emit('ok')
          }"
        />
      </footer>

      <ZLoading :value="loading" />
    </q-card>
  </q-dialog>
</template>

<style lang="scss" scoped>
.q-card {
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
