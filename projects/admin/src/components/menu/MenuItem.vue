<script setup lang="ts">
interface Props {
  icon: string
  label: string
  active?: boolean
}
const props = defineProps<Props>()

const { isExpand, isShow } = useSidebar()
const icon = reactive({
  default: '',
  active: '',
})
onBeforeMount(async () => {
  icon.default = await dynamicImport()
  icon.active = await dynamicImport('active')
})

/**
 * 动态加载icon
 */
async function dynamicImport(state: 'default' | 'active' = 'default') {
  return (await import(`../../assets/icons/menu/${state}/${props.icon}.svg?raw`)).default
}
</script>

<template>
  <div
    flex="~ items-center gap2"
    :px="isExpand ? 8 : 3.5" h12 cursor-pointer transition
    rounded-2 :bg="active ? 'white-1' : 'transparent'"
    :text="active ? 'grey-1' : 'grey-4'" hover:bg-white-1
    select-none
  >
    <div v-html="active ? icon.active : icon.default" />
    <div v-if="isShow" truncate text-sm font-500 v-text="label" />
  </div>
</template>
