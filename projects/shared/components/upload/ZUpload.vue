<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { ref } from 'vue'
import { QFile } from 'quasar'
import type { QFileProps } from 'quasar'
import ZBtn from '../btn/ZBtn.vue'
import { fileToUrl } from '../../utils/browser'
import ZLabel from '../label/ZLabel.vue'
import type { ZLabelProps } from '../label/ZLabel.vue'
import { type hint, onRejected } from '../../utils/common/uploadFile'

interface ZUploadProps extends ZLabelProps {
  modelValue?: File | File[]
  btnLabel?: string
  hint?: string
  accept?: string
  multiple?: boolean
  maxFiles?: number
  maxFileSize?: number
  disable?: boolean
  type?: 'file' | 'image'
  showFileList?: boolean
  hintMessage?: hint
  params?: Omit<
    QFileProps,
    'modelValue' | 'label' | 'hint' | 'accept' | 'multiple'
    | 'maxFiles' | 'maxFileSize' | 'disable'
  >
}

const props = withDefaults(defineProps<ZUploadProps>(), {
  type: 'file',
})
const emits = defineEmits(['update:modelValue'])

const value = useVModel(props, 'modelValue')
const ZUploadRef = ref<InstanceType<typeof QFile>>()

/**
 * 触发QFile点击事件
 */
function clickUpload() {
  if (!props.disable)
    ZUploadRef.value?.$el.click()
}

/**
 * 删除文件
 */
function deleteFile(index: number) {
  if (value.value?.length)
    emits('update:modelValue', (value.value as File[]).filter((_, i) => i !== index))
  else
    value.value = undefined
}
</script>

<template>
  <div flex="~ col gap2" text-sm font-400>
    <div flex="~ justify-between items-center">
      <ZLabel v-bind="props" />
      <div :class="{ 'flex-1': !label }">
        <QFile
          ref="ZUploadRef"
          v-model="value"
          class="hidden!"
          :accept="accept"
          :max-files="maxFiles"
          :multiple="multiple"
          :max-file-size="maxFileSize"
          :disable="disable"
          append
          @rejected="(e) => onRejected(e, hintMessage)"
        />
        <div cursor-pointer @click="clickUpload">
          <slot>
            <ZBtn size="small" color="primary-1-bg" text-color="primary-1">
              <slot name="icon">
                <svg v-if="type === 'file'" width="21" height="20" viewBox="0 0 21 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.57031 16.6673V3.33398H9.23698L10.9036 5.00065H19.237V6.66732H10.2161L8.54948 5.00065H4.23698V15.0007L6.23698 8.33398H20.487L17.987 16.6673H2.57031ZM5.98698 15.0007H16.737L18.237 10.0007H7.48698L5.98698 15.0007Z" fill="currentColor" />
                </svg>
                <svg v-else-if="type === 'image'" width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 14.1667H15L11.875 10L9.375 13.3333L7.5 10.8333L5 14.1667ZM2.5 17.5V2.5H17.5V17.5H2.5ZM4.16667 15.8333H15.8333V4.16667H4.16667V15.8333ZM7.08333 8.33333C7.43056 8.33333 7.72583 8.21167 7.96917 7.96833C8.2125 7.725 8.33389 7.43 8.33333 7.08333C8.33333 6.73611 8.21167 6.44083 7.96833 6.1975C7.725 5.95417 7.43 5.83278 7.08333 5.83333C6.73611 5.83333 6.44083 5.955 6.1975 6.19833C5.95417 6.44167 5.83278 6.73667 5.83333 7.08333C5.83333 7.43056 5.955 7.72583 6.19833 7.96917C6.44167 8.2125 6.73667 8.33389 7.08333 8.33333Z" fill="currentColor" />
                </svg>
              </slot>
              <slot name="btnLabel">
                {{ btnLabel }}
              </slot>
            </ZBtn>
          </slot>
        </div>
      </div>
    </div>
    <div v-if="hint" text="sm grey-6" font-400 v-text="hint" />
    <!-- 上传的文件列表 -->
    <template
      v-if="
        showFileList && value
          && ((typeof value.length === 'number' && value.length)
            || typeof value.length !== 'number')
      "
    >
      <div v-if="type === 'file'" flex="~ col gap2">
        <div
          v-for="(file, index) in ((value.length ? value : [value]) as File[])"
          :key="index"
          flex="~ justify-between items-center"
        >
          <div flex="~ items-center gap1">
            <div i-mdi:file-outline text-grey-5 />
            <div v-text="file.name" />
          </div>
          <div
            i-mdi:close-circle
            text-grey-4 hover:text-grey-5
            cursor-pointer
            @click="deleteFile(index)"
          />
        </div>
      </div>
      <div v-else-if="type === 'image'" flex="~ row gap2 wrap">
        <div
          v-for="(file, index) in ((value.length ? value : [value]) as File[])"
          :key="index"
          relative
        >
          <img :src="fileToUrl(file)" w16 h16>
          <div
            h6 w6 cursor-pointer flex-center
            bg="black/30" hover:bg="black/40"
            absolute top-0 right-0
            @click="deleteFile(index)"
          >
            <div i-mdi:close text-grey-1 />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
