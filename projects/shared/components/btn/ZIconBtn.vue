<script lang="ts" setup>
export interface ZIconBtnProps {
  /**
   * 图标
   */
  icon?: string
  /**
   * `svg`
   */
  svg?: string
  /**
   * 按钮说明
   */
  explain?: string
  /**
   * 是否禁用按钮
   */
  disable?: boolean
  /**
   * 是否激活按钮
   */
  active?: boolean
  /**
   * 按钮点击事件
   */
  onClick?: (_e?: MouseEvent) => void
}

defineProps<ZIconBtnProps>()
</script>

<template>
  <div
    class="z-icon-btn"
    :class="{ disabled: disable, active }"
    :cursor="disable ? 'not-allowed' : 'pointer'"
    :opacity="disable ? 70 : 100"
    select-none p2px text-grey-6
    @click="(event) => {
      if (!disable)
        onClick?.(event)
    }"
  >
    <slot>
      <div v-if="icon" size-5 :class="icon" />
      <div v-else-if="svg" v-html="svg" />
    </slot>

    <q-tooltip
      v-if="explain"
      anchor="top middle"
      self="bottom middle"
      :offset="[0, 6]"
      max-width="50%"
      v-text="explain"
    />
  </div>
</template>

<style lang="scss">
.z-icon-btn {
  &:hover:not(.disabled), &.active {
    color: var(--primary-1);
  }
}
</style>
