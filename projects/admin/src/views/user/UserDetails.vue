<script setup lang="ts">
import moment from 'moment'
import type { IUser } from 'shared/types/entities/user.interface'

interface Props {
  user?: IUser
  label?: string
}

interface UserInfo {
  label: string
  list: {
    label: string
    value: any
    required?: boolean
    flag?: boolean
    type?: 'radio' | 'image'
  }[]
}

const props = withDefaults(defineProps<Props>(), {
  label: '查看完整信息',
})

// const { adminRole } = useUser()

/** 对话框 */
const dialog = ref(false)

/** 用户id */
// const userId = computed(() => props.user?.id)
/** 用户信息 */
const userInfo = computed<UserInfo[]>(() => {
  const base = props.user
  return [
    {
      label: '基本信息',
      list: [
        {
          label: '用户名',
          value: base?.account,
          required: true,
        },
        {
          label: '账号状态',
          value: base?.isDeleted,
          type: 'radio',
        },
        {
          label: '邮箱',
          value: base?.email,
          required: true,
        },
        {
          label: '注册时间',
          value: base?.createdAt ? moment(base?.createdAt).format('YYYY-MM-DD HH:mm:ss') : '',
        },
      ],
    },
    {
      label: '权限信息',
      list: [
        {
          label: '管理员角色',
          value: base?.role?.name,
        },
      ],
    },
  ]
})
</script>

<template>
  <div class="">
    <TextBtn :label="label" @click="dialog = true" />

    <ZDialog
      v-model="dialog"
      title="查看完整信息"
      scroll
      :wrapper-style="{
        width: '900px',
        maxWidth: '900px',
      }"
    >
      <div flex="~ col gap8">
        <div v-for="info in userInfo" :key="info.label">
          <SubLabel :label="info.label" />
          <div flex="~ col gap6">
            <template
              v-for="item in info.list.filter(v => v.flag !== false)"
              :key="item.label"
            >
              <!-- 只读input -->
              <ReadonlyInput
                v-if="!item.type"
                :model-value="item.value"
                :label="item.label"
                :required="item.required"
                aligning
                label-position="left"
              />
              <!-- 只读单选 -->
              <div
                v-else-if="item.type === 'radio'"
                flex="~ items-center gap2"
              >
                <ZLabel
                  :label="item.label"
                  :required="item.required"
                  aligning w34
                />
                <div flex="~ 1 gap5" w0 relative right-2>
                  <ZRadio
                    :model-value="item.value?.toString()"
                    val="false"
                    label="启用"
                  />
                  <ZRadio
                    :model-value="item.value?.toString()"
                    val="true"
                    label="禁用"
                  />
                </div>
              </div>
            </template>
          </div>
        </div>
      </div>
    </ZDialog>
  </div>
</template>
