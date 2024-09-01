<script setup lang="ts">
import { useModel } from 'vue'
import { MdEditor } from 'md-editor-v3'
import { Emoji } from '@vavt/v3-extension'
import '@vavt/v3-extension/lib/asset/style.css'
import type { ToolbarNames } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

import type { FileBodyDto } from 'shared/types/http/file/file.body'

interface Props {
  modelValue: string
}
const props = defineProps<Props>()
defineEmits(['update:modelValue'])

const value = useModel(props, 'modelValue')

/** 工具栏 */
const toolbars: ToolbarNames[] = [
  'bold',
  'underline',
  'italic',
  '-',
  'title',
  'strikeThrough',
  'sub',
  'sup',
  'quote',
  'unorderedList',
  'orderedList',
  'task',
  '-',
  'codeRow',
  'code',
  'link',
  'image',
  'table',
  'mermaid',
  'katex',
  0,
  '-',
  'revoke',
  'next',
  'save',
  '=',
  'pageFullscreen',
  'fullscreen',
  'preview',
  'previewOnly',
  'htmlPreview',
  'catalog',
]
/** 上传图片 */
async function onUploadImg(files: File[], callback: (url: string[]) => void) {
  const res = await Promise.all(
    files.map(async (file) => {
      const form = new FormData()
      form.append('file', file)
      return await uploadFileApi(form, `/images/article/${file.name}`)
    }),
  )

  callback(res.map((item: FileBodyDto) => item.url))
}
</script>

<template>
  <MdEditor
    v-model="value"
    :toolbars
    preview-theme="github"
    :footers="['markdownTotal', '=', 0, 'scrollSwitch']"
    @on-upload-img="onUploadImg"
  >
    <template #defToolbars>
      <Emoji />
    </template>
  </MdEditor>
</template>

<style lang="scss">
.md-editor{
  border-radius: 8px;
}
</style>
