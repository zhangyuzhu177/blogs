<script lang="ts" setup>
import { useVModel } from '@vueuse/core'
import { useUser } from '../../composables/user'
import ZDialog from './ZDialog.vue'

const props = defineProps<{
  modelValue: boolean
}>()
defineEmits(['update:modelValue'])

const { logout } = useUser()
const value = useVModel(props, 'modelValue')

</script>

<template>
  <ZDialog
    v-model="value"
    title="退出登录"
    confirm-text="退出"
    footer
    :wrapper-style="{
      width: '488px',
    }"
    @ok="logout"
  >
    是否退出登录？
  </ZDialog>
</template>
