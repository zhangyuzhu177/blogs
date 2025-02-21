<script setup lang="ts">
import type { PermissionType } from 'types'
import { arrayDistinct, arrayHasIntersection, arrayIsFullIncludes } from 'utils'

import type { PermissionItem } from '~/constants/admin'

interface Props {
  /**
   * 管理员角色的权限
   */
  modelValue?: PermissionType[]
  /**
   * 是否只读
   */
  readonly?: boolean
}
const props = defineProps<Props>()
defineEmits(['update:modelValue'])

/** 管理权限 */
const permission = useVModel(props, 'modelValue')
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
    const arr = getPermission(item)
    permission.value = arrayDistinct([
      ...(permission.value ?? []),
      ...arr,
    ])
  }
  else if (!flag && permission.value) {
    const arr = getPermission(item)
    for (let i = permission.value.length - 1; i >= 0; i--) {
      if (arr.includes(permission.value[i]))
        permission.value.splice(i, 1)
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
          <ZCheckbox
            :model-value="
              arrayIsFullIncludes(permission, getPermission(item))
                || (!!item.children?.length && arrayHasIntersection(permission, getPermission(item)) && null)
            "
            :disable="readonly"
            toggle-indeterminate
            @update:model-value="val => handleSelect(val, item)"
          />
          <div
            text-sm font-500
            whitespace-nowrap
          >
            {{ item.name }}
            <span
              v-if="item.desc"
              font-400 text-grey-6
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
