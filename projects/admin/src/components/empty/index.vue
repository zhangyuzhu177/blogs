<script setup lang="ts">
import denied from '~/assets/empty/denied.svg?raw'
import item from '~/assets/empty/item.svg?raw'

interface EmptyProps {
  icon?: keyof (typeof icons)
  label?: string
  captions?: string
}

withDefaults(defineProps<EmptyProps>(), {
  icon: 'item',
  label: '暂无数据',
})

const icons = {
  denied,
  item,
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
