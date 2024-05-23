<script setup lang="ts">
import type { PermissionType } from 'sust-types'
import { hasIntersection, isFullIncludes } from 'sust-utils'
import type { PermissionItem } from '~/constants/admin'

interface Props {
  modelValue: PermissionType[]
  readonly?: boolean
}
const props = defineProps<Props>()
defineEmits(['update:modelValue'])

/** 管理权限 */
const value = useVModel(props, 'modelValue')
const { getPermission } = useRole()
/** 当前选中的权限 */
const selectData = ref<Partial<PermissionItem>[]>([{
  children: ADMIN_MENU_LIST,
}])

/**
 * 选中权限
 */
function handleSelect(flag: boolean | null, item: PermissionItem) {
  if (flag || flag === null) {
    const permission = getPermission(item, true)
    value.value.push(...permission)
    value.value = arrayDistinct(value.value)
  }
  else {
    const permission = getPermission(item)
    for (let i = value.value.length - 1; i >= 0; i--) {
      const item = value.value[i]
      if (permission.includes(item))
        value.value.splice(i, 1)
    }
  }
}
</script>

<template>
  <div flex>
    <div
      v-for="(data, i) in selectData" :key="i"
      class="permission-list"
      pr2 flex="~ col gap2"
    >
      <div
        v-for="item in data.children?.filter(v => v.flag !== false)"
        :key="item.name"
        flex="~ items-center justify-between gap4"
        p="r2 y3px" rounded-6px
        hover:bg-grey-3 cursor-default
        @click="() => {
          selectData.splice(i + 1, selectData.length - i)
          if (item.children?.length)
            selectData.push(item)
        }"
      >
        <div flex="~ items-center">
          <q-checkbox
            :model-value="
              isFullIncludes(value, getPermission(item, true))
                || (!!item.children?.length && hasIntersection(value, getPermission(item)) && null)
            "
            :disable="readonly"
            toggle-indeterminate
            @update:model-value="val => handleSelect(val, item)"
          />
          <div
            text-sm font-500
            :text="item.name === selectData[i + 1]?.name ? 'primary-1' : 'grey-8'"
            whitespace-nowrap
          >
            {{ item.name }}
            <span
              v-if="item.desc"
              font-400 text-grey-5
              v-text="`（${item.desc}）`"
            />
          </div>
        </div>
        <div
          v-if="item.children?.length"
          i-mingcute:right-line
          w4 h4
          :text="item.name === selectData[i + 1]?.name ? 'primary-1' : 'grey-8'"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.permission-list {
  contain: none;

  .q-checkbox {
    :deep(.q-checkbox__inner) {
      font-size: 34px;

      .q-checkbox__bg {
        width: 18px;
        height: 18px;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
  }
}
</style>
