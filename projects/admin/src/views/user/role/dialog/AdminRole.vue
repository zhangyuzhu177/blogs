<script setup lang="ts">
import { Notify } from 'quasar'
import type { IRole, IUpsertRoleBodyDto } from 'types'
import { validateRoleDesc, validateRoleName } from 'shared/utils/validators'

import { objectPick } from 'utils'
import RolePermission from './RolePermission.vue'

interface RoleDialogProps {
  /**
   * 管理员角色对话框的操作类型
   */
  type?: DialogType
  /**
   * 管理员角色信息
   */
  role?: IRole
  /**
   * 在更新插入管理员角色后的回调
   */
  onCallback?: () => void
}

const props = defineProps<RoleDialogProps>()
const emits = defineEmits<{
  /**
   * 更新管理员角色对话框的操作类型
   */
  'update:type': [RoleDialogProps['type']]
}>()

const rolePermission = ref<HTMLElement>()

const { height } = useElementSize(rolePermission)

/** 对话框 */
const dialog = computed({
  get() {
    const { type, role } = props
    return type === '添加' || (!!type && !!role)
  },
  set() {
    emits('update:type', undefined)
  },
})

/** 是否只读 */
const readonly = computed(() => props.type === '查看')
/** 管理员角色表单 */
const form = ref<IUpsertRoleBodyDto>({
  name: '',
})

watch(
  dialog,
  (newVal) => {
    if (newVal) {
      const { type, role } = props
      if (type === '添加') {
        form.value = {
          name: '',
        }
      }
      else if (role) {
        form.value = {
          ...objectPick(role, 'name', 'desc'),
          permissions: role.permissions?.map(v => v.name),
        }
      }
    }
  },
)

/** 禁用提交 */
const disable = computed(() => {
  const { name, desc } = form.value
  return !!validateRoleName(name)
    || !!validateRoleDesc(desc)
})

/**
 * 提交
 */
async function submit() {
  if (disable.value)
    return

  const { type, role, onCallback } = props

  if (type === '添加')
    await createRoleApi(form.value)
  else if (type === '编辑')
    await updateRoleApi(form.value, role!.id)

  Notify.create({
    type: 'success',
    message: `${type}成功`,
  })

  onCallback?.()
}
</script>

<template>
  <ZDialog
    v-model="dialog"
    :title="`${type}角色`"
    confirm-text="保存"
    :footer="!readonly" scroll
    :disable-confirm="disable"
    :wrapper-style="{
      width: '912px',
      maxWidth: '912px',
    }"
    @ok="submit"
  >
    <div flex="~ col gap1">
      <ZInput
        v-model="form.name"
        label="角色名称"
        placeholder="请输入角色名称（10 字以内）"
        required :readonly
        :rules="[
          (val: string) => validateRoleName(val) || true,
        ]"
      />
      <ZInput
        v-model="form.desc"
        label="描述"
        placeholder="请输入描述（200 字以内）"
        type="textarea"
        :readonly
        :rules="[
          (val: string) => validateRoleDesc(val) || true,
        ]"
      />
      <div flex="~ col gap4">
        <ZLabel label="权限" />
        <q-scroll-area
          p2 rounded-3 bg-grey-2
          :style="{ height: `${height + 16}px` }"
        >
          <RolePermission
            ref="rolePermission"
            v-model="form.permissions"
            :readonly="readonly"
          />
        </q-scroll-area>
      </div>
    </div>
  </ZDialog>
</template>
