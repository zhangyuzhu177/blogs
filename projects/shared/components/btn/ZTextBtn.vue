<script lang="ts" setup>
interface ZTextBtnProps {
  color?: string
  label?: string
  disable?: boolean
}

withDefaults(defineProps<ZTextBtnProps>(), {
  color: 'primary-1',
})
defineEmits(['click'])
</script>

<template>
  <div
    :style="{
      color: `var(--${color})`,
    }"
    text="sm center" font-400
    :cursor="disable ? 'not-allowed' : 'pointer'"
    :opacity="disable ? 70 : 100"
    select-none inline
    @click="() => {
      if (!disable)
        $emit('click')
    }"
  >
    {{ label }}
    <slot />
  </div>
</template>
