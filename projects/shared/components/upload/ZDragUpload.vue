<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'
import { QFile } from 'quasar'
import type { QFileProps } from 'quasar'

import ZLabel from '../label/ZLabel.vue'
import type { ZLabelProps } from '../label/ZLabel.vue'
import { onRejected } from '../../utils/common/uploadFile'

interface ZDragUploadProps extends ZLabelProps {
  modelValue?: File
  hint?: string
  accept?: string
  maxFileSize?: number
  showFileList?: boolean
  disable?: boolean
  params?: Omit<
    QFileProps,
    'modelValue' | 'label' | 'hint' | 'accept' | 'maxFileSize'
  >
}

const props = withDefaults(defineProps<ZDragUploadProps>(), {
  hint: '选择文件',
  showFileList: true,
})
defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const ZUploadRef = ref<InstanceType<typeof QFile>>()

/** 是否拖拽 */
const active = ref(false)

/**
 * 触发QFile点击事件
 */
function clickUpload() {
  ZUploadRef.value?.$el.click()
}

/**
 * 拖拽文件
 */
function dragFile(e: DragEvent) {
  active.value = false
  value.value = e.dataTransfer?.files[0]
}
</script>

<template>
  <div flex="~ col gap2" text-sm>
    <ZLabel v-bind="props" />
    <QFile
      ref="ZUploadRef"
      v-model="value"
      class="hidden!"
      :accept="accept"
      :max-file-size="maxFileSize"
      @rejected="onRejected"
    />
    <div relative>
      <div
        py13 flex="~ col gap6"
        b-1px :b="active ? 'solid grey-4' : 'dashed grey-3'"
        :bg="active ? 'grey-2' : 'grey-1'" transition
        hover:b-grey-4
        @dragenter.prevent="active = !active"
        @dragleave.prevent="active = !active"
        @dragover.prevent
        @drop.prevent="dragFile"
      >
        <div
          flex="~ col self-center items-center gap2"
          text-primary-1 cursor-pointer
          @click="clickUpload"
        >
          <div
            w14 h14 flex-center b="1px primary-1" transition
            :bg="active ? 'primary-1/20' : 'primary-1/12'"
          >
            <div w6 h6 i-mdi:plus />
          </div>
          <div font-500 v-text="hint" />
        </div>
        <div
          v-if="value"
          flex="center gap4"
        >
          <div flex="~ items-center gap1" style="max-width: calc(100% - 40px)">
            <div min-w-4 i-mdi:file-outline text-grey-5 />
            <div truncate v-text="value.name" />
          </div>
          <div
            i-mdi:close-circle
            text-grey-4 hover:text-grey-5
            cursor-pointer
            @click="value = undefined"
          />
        </div>
      </div>

      <!-- 禁用 -->
      <div
        v-if="disable"
        absolute inset-0 z-10
        cursor-not-allowed
        bg-white-3
      />
    </div>
  </div>
</template>
