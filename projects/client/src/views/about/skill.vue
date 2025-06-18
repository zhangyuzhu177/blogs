<script setup lang="ts">
interface SkillProps {
  skills?: {
    id?: string
    /** 名称 */
    name?: string
    /** 描述 */
    desc?: string
    /** 等级 */
    level?: number
  }[]
}

defineProps<SkillProps>()

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
  <div v-if="skills?.length" flex="~ col gap4 ">
    <div subtitle-1 text-center v-text="'专业技能'" />
    <div flex="~ col gap4" sm="flex-wrap flex-row">
      <div
        v-for="skill in skills" :key="skill.id"
        flex="~ 1 col gap2" b-rd-2 sm="p-4"
        p-2 min-w-56 relative
        border="1 grey-3 dark:grey-8"
        bg="grey-1 dark:grey-9"
      >
        <div
          v-if="skill?.name"
          :class="icons.find(item => item.name.includes(skill?.name as string))?.icon || 'i-mingcute:terminal-line'"
          w-6 h-6
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
          style="background-color: var(--grey-3);"
        />
      </div>
    </div>
  </div>
</template>
