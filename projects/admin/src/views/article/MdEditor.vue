<script setup lang="ts">
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import { useModel } from 'vue'

interface Props {
  modelValue: string
}
const props = defineProps<Props>()
defineEmits(['update:modelValue'])

const value = useModel(props, 'modelValue')
</script>

<template>
  <MdEditor v-model="value" />
</template>

<style lang="scss">
.md-editor{
  border-radius: 8px;
  .md-editor-toolbar-right {
    .md-editor-toolbar-item:last-child {
      display: none
    }
  }
}
</style>
