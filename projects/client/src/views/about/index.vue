<script setup lang="ts">
import { SysConfig } from 'types'
import type { IConfigDto } from 'types'

/** 配置 */
const config = ref<IConfigDto[SysConfig.ABOUT]>()
/** 默认头像 */
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

onBeforeMount(async () => {
  const data = await getConfigApi(SysConfig.ABOUT) || {}
  config.value = data as IConfigDto[SysConfig.ABOUT]
})

/** 预设图标 */
const icons: { name: string; icon: string }[] = [
  {
    name: 'Vue',
    icon: 'i-bxl:vuejs',
  },
  {
    name: 'React',
    icon: 'i-bxl:react',
  },
  {
    name: 'Docker',
    icon: 'i-bxl:docker',
  },
  {
    name: 'JavaScript',
    icon: 'i-bxl:javascript',
  },
  {
    name: 'TypeScript',
    icon: 'i-bxl:typescript',
  },
  {
    name: 'Python',
    icon: 'i-bxl:python',
  },
  {
    name: 'Java',
    icon: 'i-bxl:java',
  },
  {
    name: 'Linux',
    icon: 'i-bxl:tux',
  },
  {
    name: 'Tailwind',
    icon: 'i-bxl:tailwind-css',
  },
  {
    name: 'CSS',
    icon: 'i-bxl:css3',
  },
  {
    name: 'HTML',
    icon: 'i-bxl:html5',
  },
  {
    name: 'UI设计',
    icon: 'i-bxl:figma',
  },
  {
    name: '数据库',
    icon: 'i-mdi:database',
  },
  {
    name: '后端开发',
    icon: 'i-mdi:server-minus-outline',
  },
  {
    name: '前端开发',
    icon: 'i-mdi:code-block-tags',
  },
  {
    name: 'UI框架',
    icon: 'i-mingcute:palette-line',
  },
  {
    name: '系统架构',
    icon: 'i-mingcute:sitemap-line',
  },
]
</script>

<template>
  <div flex="~ col gap6 sm:gap10" py-8>
    <div flex="~ col center gap2 sm:gap4">
      <div flex="~ justify-center">
        <q-img w-40 h-40 b-rd-full overflow-hidden shadow-2xl loading="lazy" :src="config?.avatar || defaultAvatar" />
      </div>
      <div max-w-150 flex="~ items-center col gap1">
        <h1 v-text="config?.name" />
        <div subtitle-2 flex="~ items-center gap2">
          <div
            v-if="config?.github"
            flex="~ items-center gap1"
            style="color:var(--grey-6)"
          >
            <a :href="config?.github" target="_blank">
              <div size-5 i-bxl:github />
            </a>
          </div>
          <div
            v-if="config?.email"
            flex="~ items-center gap1"
            style="color:var(--grey-6)"
          >
            <a :href="`mailto:${config?.email}`" target="_blank">
              <div size-5 i-mingcute:mail-fill />
            </a>
          </div>
          <div
            flex="~ items-center gap1"
            style="color:var(--grey-6)"
          >
            <div size-5 i-mingcute:location-line />
            <div v-text="config?.location" />
          </div>
        </div>
        <div style="color:var(--grey-6)" subtitle-2 v-text="config?.job" />
        <div style="color:var(--grey-6)" subtitle-3 text-center v-text="config?.desc" />
      </div>
    </div>
    <div
      v-if="config?.skills?.length"
      flex="~ col gap4 "
    >
      <div subtitle-1 text-center v-text="'专业技能'" />
      <div flex="~ col gap4" sm="flex-wrap flex-row">
        <div
          v-for="skill in config?.skills" :key="skill.id"
          flex="~ col gap2" b-rd-2 sm="p-4" p-2 min-w-56 flex-1
          style="background-color: var(--grey-2);"
        >
          <div
            v-if="skill?.name"
            :class="icons.find(item => item.name.includes(skill?.name as string))?.icon || 'i-mingcute:terminal-line'"
            w-6 h-6 text="primary-1"
          />
          <div subtitle-2 v-text="skill?.name" />
          <div
            text-sm text-nowrap truncate
            style="color:var(--grey-6)" v-text="skill?.desc"
          />
          <q-linear-progress
            v-if="skill?.level"
            :value="skill?.level / 100"
            h-1.5 b-rd-2
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar {
  &:hover {
    transform: rotate(666turn);
    transition-delay: 1s;
    transition-property: transform;
    transition-duration: 59s;
    transition-timing-function: cubic-bezier(0.34, 0, 0.84, 1);
  }
}

:deep(.q-btn){
  .q-focus-helper {
    display: none;
  }

  .q-ripple {
    display: none;
  }

  .q-tab__indicator{
    display: none;
  }
}

:deep(.md-editor) {
  background-color: transparent !important;

  .md-editor-preview-wrapper{
    padding: 0;
    .md-editor-preview {
      h1 {
        color: var(--grey-9);
      }
      p {
        color: var(--grey-9);
      }
    }
  }
}
</style>
