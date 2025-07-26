<script setup lang="ts">
import { Notify } from 'quasar'
import { SysConfig } from 'types'
import { cloneDeep, isArray } from 'lodash'
import {
  VueDraggable,
} from 'vue-draggable-plus'
import type { IConfigDto } from 'types'
import { randomId, validateUrl } from 'utils'
import { validateDesc, validateEmail, validateName } from 'shared/utils/validators'

const { PAGE_NAV, active } = usePageAdmin()

/** 加载中 */
const loading = ref(false)
/** 初始化配置 */
const initData: IConfigDto[SysConfig.ABOUT] = {
  avatar: '',
  name: '',
  job: '',
  location: '',
  skills: [
    {
      id: randomId(),
      name: '',
      level: 0,
      desc: '',
    },
  ],
  desc: '',
  email: '',
  github: '',
}
/** 页面配置 */
const config = ref<IConfigDto[SysConfig.ABOUT]>(cloneDeep(initData))
/** 旧数据 */
const oldConfig = ref<IConfigDto[SysConfig.ABOUT]>()

/** 上传头像 */
const avatar = ref<File>()
watch(
  avatar,
  async (newVal) => {
    loading.value = true
    try {
      if (newVal) {
        const formData = new FormData()
        formData.append('file', newVal as File)
        const res = await uploadFileApi(formData, `/images/avatar/${newVal.name}`)
        config.value!.avatar = res.url
      }
    }
    finally {
      loading.value = false
      avatar.value = undefined
    }
  },
)

const disable = computed(() => {
  const { name, email, github, desc } = config.value || {}

  return JSON.stringify(config.value) === JSON.stringify(oldConfig.value)
    || (!!name && !!validateName(name))
    || (!!email && !!validateEmail(email))
    || (!!github && !!validateUrl(github))
    || (!!desc && !!validateDesc(desc))
})

/** 获取数据 */
async function getConfigList() {
  loading.value = true
  try {
    const data = await getConfigApi(active.value) || initData
    config.value = {
      // ...initData,
      ...(data as IConfigDto[SysConfig.ABOUT]),
      skills: (data as IConfigDto[SysConfig.ABOUT])?.skills || [{
        id: randomId(),
        name: '',
        level: 0,
        desc: '',
      }],
    }
    oldConfig.value = JSON.parse(JSON.stringify(data))
  }
  finally {
    loading.value = false
  }
}

/** 保存修改 */
async function save() {
  if (disable.value)
    return

  loading.value = true
  try {
    const data = await upsertConfigApi({
      version: active.value,
      [SysConfig.ABOUT]: {
        ...config.value,
      },
    })
    if (data) {
      Notify.create({
        message: '修改成功',
        type: 'success',
      })
      getConfigList()
    }
  }
  finally {
    loading.value = false
  }
}

onBeforeMount(() => {
  getConfigList()
})
</script>

<template>
  <div flex="~ col gap4" full>
    <ZLoading :value="loading" />
    <!-- 标题 -->
    <div flex="~ items-center justify-between">
      <h3 v-text="PAGE_NAV[1].label" />
      <ZBtn
        label="保存"
        :disable="disable"
        @click="save()"
      >
        <template #left>
          <div size-5 i-mingcute:save-2-line />
        </template>
      </ZBtn>
    </div>

    <div flex="~ col gap4" overflow-auto>
      <div flex="~ col gap1">
        <div flex="~ col items-center gap2" mb-5>
          <ZUpload
            v-model="avatar"
            type="image"
            accept="image/*"
            w-30 b-rd-4
          >
            <div
              v-if="!config?.avatar"
              flex="~ col gap2 center"
              b-rd-full full h-30
              border="1px dashed gray-5"
            >
              <div text="6 grey-5" i-ph:plus />
              <div text="grey-5" v-text="'上传头像'" />
            </div>
            <div
              v-else flex="~ col gap2 center" b-rd-full full
              h-30 overflow-hidden relative
            >
              <q-img loading="lazy" full :src="config?.avatar" />
            </div>
          </ZUpload>
        </div>
        <ZInput
          v-model="config!.name"
          label="名称"
          placeholder="请输入名称"
          :rules="[
            (val: string) => !val || validateName(val) || true,
          ]"
        />
        <ZInput
          v-model="config!.job"
          label="职位"
          placeholder="请输入职位"
          mb-5
        />
        <ZInput
          v-model="config!.location"
          label="所在地"
          :max="6"
          placeholder="请输入所在地"
          mb-5
        />
        <ZInput
          v-model="config!.email"
          label="邮箱"
          placeholder="请输入邮箱"
          :rules="[
            (val:string) => !val || validateEmail(val) || true,
          ]"
        />
        <ZInput
          v-model="config!.github"
          label="GitHub地址"
          placeholder="请输入GitHub地址"
          :rules="[
            (val:string) => !val || validateUrl(val) || true,
          ]"
        />
        <ZInput
          v-model="config!.desc"
          type="textarea"
          label="描述"
          placeholder="请输入描述（200 字以内）"
          :rules="[
            (val:string) => !val || validateDesc(val) || true,
          ]"
        />
        <div flex="~ col gap2">
          <div flex="~ justify-between gap2">
            <ZLabel label="技能" />
            <ZTextBtn
              label="添加项"
              @click="config?.skills?.push({
                id: randomId(),
                name: '',
                desc: '',
              })"
            />
          </div>

          <VueDraggable
            v-if="isArray(config?.skills) && config?.skills?.length"
            v-model="config.skills"
            item-key="id"
            :animation="300"
            drag-class="drag"
            class="flex flex-1 flex-col flex-nowrap gap2 h0 overflow-y-auto"
            :group="{ name: 'skills' }"
          >
            <div
              v-for="(skill, index) in config.skills" :key="skill.id"
              flex="~ col gap2" bg-grey-2 b="1  grey-3" p4
              b-rd-2
            >
              <div flex="~ justify-between">
                <div subtitle-3 v-text="`列表项 ${index + 1}`" />
                <ZIconBtn
                  icon="i-mingcute:close-line"
                  :disable="config?.skills!.length === 1"
                  @click="() => {
                    if (config?.skills!.length !== 1)
                      config?.skills?.splice(index, 1)
                  }"
                />
              </div>
              <div>
                <ZInput
                  v-model="skill.name"
                  label="名称"
                  placeholder="请输入名称"
                  :rules="[
                    (val: string) => !val || validateName(val) || true,
                  ]"
                />
                <ZInput
                  v-model="skill.level"
                  label="熟练度(%)"
                  type="number"
                  placeholder="请输入熟练度（单位%，1-100）"
                  :max="100"
                  mb-5
                />
                <ZInput
                  v-model="skill.desc"
                  label="描述"
                  placeholder="请输入描述"
                  mb-5
                />
              </div>
            </div>
          </VueDraggable>
        </div>
      </div>
    </div>
  </div>
</template>
