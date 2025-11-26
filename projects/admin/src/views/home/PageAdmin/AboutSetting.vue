<script setup lang="ts">
import { Notify } from 'quasar'
import { SysConfig } from 'types'
import type { IConfigDto } from 'types'
import { cloneDeep, isArray } from 'lodash'
import { randomId, validateUrl } from 'utils'
import { VueDraggable } from 'vue-draggable-plus'
import { validateDesc, validateEmail, validateName } from 'shared/utils/validators'

const { PAGE_NAV, active } = usePageAdmin()

/** 技能列表折叠状态 */
const skillsCollapsed = ref(false)
/** 作品列表折叠状态 */
const worksCollapsed = ref(false)

/** 加载中 */
const loading = ref(false)
/** 初始化配置 */
const initData: IConfigDto[SysConfig.ABOUT] = {
  avatar: '',
  name: '',
  job: '',
  location: '',
  skills: [],
  works: [],
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
  const currentConfig = config.value
  const { name, email, github, desc } = currentConfig || {}

  const skillsList = currentConfig?.skills
  const worksList = currentConfig?.works
  const skillsEmpty = !isArray(skillsList) || skillsList.length === 0
  const worksEmpty = !isArray(worksList) || worksList.length === 0

  const skillsInvalid = isArray(skillsList) && skillsList.some((skill) => {
    if (!skill)
      return false

    const level = skill.level
    const levelFilled = level !== undefined && level !== null && `${level}` !== ''
    const parsedLevel = Number(level)
    const levelInvalid = levelFilled && (Number.isNaN(parsedLevel) || parsedLevel < 0 || parsedLevel > 100)

    return (!!skill.name && !!validateName(skill.name))
      || (!!skill.desc && !!validateDesc(skill.desc))
      || levelInvalid
  })

  const skillsIncomplete = isArray(skillsList) && skillsList.some((skill) => {
    if (!skill)
      return true

    const level = skill.level
    const levelFilled = level !== undefined && level !== null && `${level}` !== ''

    return !skill.name?.trim()
      || !skill.desc?.trim()
      || !levelFilled
  })

  const worksInvalid = isArray(worksList) && worksList.some((work) => {
    if (!work)
      return false

    return (!!work.name && !!validateName(work.name))
      || (!!work.desc && !!validateDesc(work.desc))
      || (!!work.icon && !!validateUrl(work.icon))
      || (!!work.url && !!validateUrl(work.url))
  })

  const worksIncomplete = isArray(worksList) && worksList.some((work) => {
    if (!work)
      return true

    return !work.name?.trim()
      || !work.desc?.trim()
      || !work.icon?.trim()
      || !work.url?.trim()
  })

  return JSON.stringify(currentConfig) === JSON.stringify(oldConfig.value)
    || (!!name && !!validateName(name))
    || (!!email && !!validateEmail(email))
    || (!!github && !!validateUrl(github))
    || (!!desc && !!validateDesc(desc))
    || skillsEmpty
    || worksEmpty
    || skillsIncomplete
    || worksIncomplete
    || skillsInvalid
    || worksInvalid
})

/** 获取数据 */
async function getConfigList() {
  loading.value = true
  try {
    const data = await getConfigApi(active.value) || initData
    config.value = {
      // ...initData,
      ...(data as IConfigDto[SysConfig.ABOUT]),
      skills: (data as IConfigDto[SysConfig.ABOUT])?.skills || [],
      works: (data as IConfigDto[SysConfig.ABOUT])?.works || [],
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
    <div flex="~ items-center justify-between" py-2 b-b="1 grey-3">
      <div subtitle-1 v-text="PAGE_NAV[1].label" />
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
        <div flex="~ col gap2" mb-5>
          <div flex="~ justify-between gap2">
            <div flex="~ items-center gap2">
              <ZLabel label="技能" />
              <div
                i-mingcute:down-line
                transition-all cursor-pointer size-5 text-primary-1
                :style="{ transform: `rotate(${skillsCollapsed ? '180deg' : '0deg'})` }"
                @click="skillsCollapsed = !skillsCollapsed"
              />
            </div>
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
            v-show="!skillsCollapsed"
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

        <div flex="~ col gap2" mb-5>
          <div flex="~ justify-between gap2">
            <div flex="~ items-center gap2">
              <ZLabel label="作品" />
              <div
                i-mingcute:down-line
                transition-all cursor-pointer size-5 text-primary-1
                :style="{ transform: `rotate(${worksCollapsed ? '180deg' : '0deg'})` }"
                @click="worksCollapsed = !worksCollapsed"
              />
            </div>
            <ZTextBtn
              label="添加项"
              @click="config?.works?.push({
                id: randomId(),
                name: '',
                icon: '',
                url: '',
                desc: '',
              })"
            />
          </div>
          <VueDraggable
            v-if="isArray(config?.works) && config?.works?.length"
            v-show="!worksCollapsed"
            v-model="config.works"
            item-key="id"
            :animation="300"
            drag-class="drag"
            class="flex flex-1 flex-col flex-nowrap gap2 h0 overflow-y-auto"
            :group="{ name: 'skills' }"
          >
            <div
              v-for="(work, index) in config.works" :key="work.id"
              flex="~ col gap2" bg-grey-2 b="1  grey-3" p4
              b-rd-2
            >
              <div flex="~ justify-between">
                <div subtitle-3 v-text="`列表项 ${index + 1}`" />
                <ZIconBtn
                  icon="i-mingcute:close-line"
                  :disable="config?.works!.length === 1"
                  @click="() => {
                    if (config?.works!.length !== 1)
                      config?.works?.splice(index, 1)
                  }"
                />
              </div>
              <div>
                <ZInput
                  v-model="work.name"
                  label="名称"
                  placeholder="请输入名称"
                  :rules="[
                    (val: string) => !val || validateName(val) || true,
                  ]"
                />
                <ZInput
                  v-model="work.icon"
                  label="图标"
                  placeholder="请输入图标地址"
                  :rules="[
                    (val: string) => !val || validateUrl(val) || true,
                  ]"
                />
                <ZInput
                  v-model="work.url"
                  label="地址"
                  placeholder="请输入作品地址"
                  :rules="[
                    (val: string) => !val || validateUrl(val) || true,
                  ]"
                />
                <ZInput
                  v-model="work.desc"
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
