<script setup lang="ts">
import type { QBtnProps } from 'quasar'
import { useSysConfig } from '../../composables/app'

interface ZBtnProps {
  color?: string
  textColor?: string
  label?: string
  size?: 'small' | 'medium' | 'big'
  disable?: boolean
  right?: boolean
  params?: Omit<QBtnProps, 'color' | 'textColor' | 'label' | 'size' | 'disable'>
}

const { params } = withDefaults(defineProps<ZBtnProps>(), {
  color: 'primary-1',
  textColor: 'grey-1',
  size: 'medium',
})

const { isAdmin } = useSysConfig()
</script>

<template>
  <q-btn
    class="z-btn"
    :class="{ 'is-admin': isAdmin }"
    unelevated square
    min-h="auto!"
    :px="size === 'big' ? 6 : 4"
    :py="size === 'big' ? 3 : size === 'medium' ? '10px' : '6px'"
    :text="size === 'big' ? 'base' : 'sm'"
    :color="color"
    :text-color="textColor"
    :disable="disable"
    no-caps
    v-bind="params"
  >
    <div flex="~ row items-center gap2">
      <slot name="left" />
      <div v-if="label" v-text="label" />
      <slot />
      <slot name="icon">
        <svg v-if="right" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M14 18L12.6 16.55L16.15 13H4V11H16.15L12.6 7.45L14 6L20 12L14 18Z" :fill="`var(--${textColor})`" />
        </svg>
      </slot>
    </div>
  </q-btn>
</template>

<style lang="scss" scoped>
.q-btn {
  &.is-admin {
    border-radius: 8px;
  }
}
</style>
