<script setup lang="ts">
const iconModules = import.meta.glob('../../assets/empty/*.svg', {
  eager: true,
  import: 'default',
  query: '?raw',
})

type EmptyIcon = 'denied' | 'item'

interface EmptyProps {
  icon?: EmptyIcon
  label?: string
  captions?: string
}

withDefaults(defineProps<EmptyProps>(), {
  icon: 'item',
  label: '暂无数据',
})

const icons: Record<EmptyIcon, string> = {
  denied: iconModules['../../assets/empty/denied.svg'] as string,
  item: iconModules['../../assets/empty/item.svg'] as string,
}
</script>

<template>
  <div class="empty" h-full flex-center px4>
    <div flex="~ col gap16" relative bottom="10%">
      <div flex="center col gap6">
        <div text-primary-1 v-html="icons[icon]" />
        <div flex="~ col items-center gap2" text-center>
          <div
            text="lg grey-8"
            v-text="label"
          />
          <div
            v-if="captions"
            text="sm grey-5"
            v-text="captions"
          />
        </div>
      </div>
      <slot />
    </div>
  </div>
</template>
