<script setup lang="ts">
export interface ZLabelProps {
  label?: string
  caption?: string
  dark?: boolean
  required?: boolean
  aligning?: boolean
}

defineProps<ZLabelProps>()
</script>

<template>
  <div
    v-if="label"
    text-sm font-500 flex="~ gap1 wrap"
    :text="dark ? 'grey-1' : 'grey-8'"
  >
    <div
      v-if="required || aligning"
      text-alerts-error
      :style="{
        visibility: required ? 'visible' : 'hidden',
      }"
    >
      *
    </div>
    {{ label }}
    <div
      v-if="caption"
      :text="dark ? 'white-7' : 'grey-6'"
      font-400
      v-text="caption"
    />
  </div>
</template>
