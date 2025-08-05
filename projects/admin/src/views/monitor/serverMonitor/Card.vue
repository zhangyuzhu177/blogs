<script setup lang="ts">
export interface Items {
  label: string
  value?: string
  width?: string
}

export interface CardProps {
  /**
   * 标题
   */
  title: string
  /**
   * 数据项
   */
  items: Items[]
}
defineProps<CardProps>()
</script>

<template>
  <div flex="~ col gap4" b="1 grey-3" b-rd-2 p-4>
    <div subtitle-2 v-text="title" />
    <div flex="~ gap4">
      <div flex-1 b="1 grey3" b-rd-1 overflow-hidden>
        <div
          v-for="(item, index) in items" :key="item.label"
          :class="index === items.length - 1 ? '' : 'b-b-1 b-b-grey3'"
          flex
        >
          <div
            :class="item?.width ? '' : 'flex-1'"
            :style="{ width: item?.width ?? 'auto' }"
            flex="~ items-center" b-r="1 grey-3"
            px-3 py-2 bg-grey-2
            v-text="item.label"
          />
          <div flex-1 px-3 py-2 v-text="item.value" />
        </div>
        <slot name="item" />
        <slot />
      </div>
      <slot name="chart" />
    </div>
  </div>
</template>
