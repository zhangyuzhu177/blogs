<script setup lang="ts">
import type { ISkillsConfigDto } from 'types'

defineProps<{ skills: ISkillsConfigDto[] }>()

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
  <div flex="~ col gap6">
    <div flex="~ center gap-2">
      <div w-1 h-1 b-rd-full bg="grey-9 dark:grey-1" />
      <h3 text-center v-text="'SKILLS'" />
      <div w-1 h-1 b-rd-full bg="grey-9 dark:grey-1" />
    </div>
    <div
      grid
      grid-cols-1
      sm="grid-cols-2"
      b="1 solid grey-3 dark:grey-7"
      rounded-3
      overflow-hidden
    >
      <div
        v-for="(skill, index) in skills"
        :key="skill.id"
        :style="{ '--skill-index': index }"
        flex="~ 1 col gap2"
        sm="p-4"
        p-2
        relative
        bg="grey-1 dark:grey-9"
        flex-1
        :class="[
          // =========================
          // 移动端：单列布局
          // 除了最后一个，全部添加底部边框
          // =========================
          index !== skills.length - 1
            && 'border-b border-solid border-grey-3 dark:border-grey-7',

          // =========================
          // sm：两列布局
          // 第一行添加底部边框
          // =========================
          index < 2
            && 'sm:border-b sm:border-solid sm:border-grey-3 dark:sm:border-grey-7',

          // 第二行取消移动端继承的底部边框
          index >= 2
            && 'sm:border-b-0',

          // =========================
          // sm：左侧元素添加右边框
          // index 0、2
          // =========================
          index % 2 === 0
            && 'sm:border-r sm:border-solid sm:border-grey-3 dark:sm:border-grey-7',
        ]"
      >
        <!-- 图标 -->
        <div
          v-if="skill?.name"
          :class="
            icons.find(item => item.name.includes(skill?.name as string))?.icon
              || 'i-mingcute:terminal-line'
          "
          w-6
          h-6
        />

        <!-- 标题 -->
        <div
          v-text="skill?.name"
        />

        <!-- 描述 -->
        <div
          text-sm
          text-nowrap
          truncate
          style="color: var(--grey-6)"
          v-text="skill?.desc"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.skill-title {
  opacity: 0;
  animation: fadeInUp 0.6s ease-out forwards;
  animation-delay: 0.75s;
}

.skill-card {
  opacity: 0;
  animation: fadeInScale 0.6s ease-out forwards;
  animation-delay: calc(1s + var(--skill-index) * 0.1s);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
</style>
