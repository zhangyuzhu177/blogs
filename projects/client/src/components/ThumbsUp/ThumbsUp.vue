<script setup lang="ts">
import { ref } from 'vue'
import likeIcon from '~/assets/icons/like.svg?raw'

interface ThumbsUoProps {
  /**
   * 是否点赞
   */
  liked: boolean
  /**
   * 点赞数量
   */
  count?: number
  /**
   * 点赞后回调
   */
  onCallback?: () => void
}

const props = defineProps<ThumbsUoProps>()

const emit = defineEmits<{
  /** 点赞回调 */
  'update:liked': [ThumbsUoProps['liked']]
}>()

const animating = ref(false)
const isHover = ref(false)

/**
 * 点赞
 */
function handleLike() {
  if (animating.value || props.liked)
    return
  const { liked, onCallback } = props
  animating.value = true
  emit('update:liked', !liked)
  setTimeout(() => {
    animating.value = false
  }, 800)
  onCallback?.()
}

function getConfettiStyle(n: number) {
  const angle = (360 / 24) * n
  const distance = 60 + Math.random() * 30
  const colors = ['#FFD93B', '#6BCB77', '#4D96FF', '#FF6B6B', '#FFB5E8']
  const rotate = Math.random() * 360
  const scale = 0.8 + Math.random() * 0.7
  return {
    'left': `calc(50% + ${Math.cos(angle * Math.PI / 180) * 8}px)`,
    'top': `calc(50% + ${Math.sin(angle * Math.PI / 180) * 8}px)`,
    'background': colors[n % colors.length],
    'transform': `scale(${scale}) rotate(${rotate}deg)`,
    '--confetti-x': `${Math.cos(angle * Math.PI / 180) * distance}px`,
    '--confetti-y': `${Math.sin(angle * Math.PI / 180) * distance}px`,
    'animationDelay': `${Math.random() * 0.2}s`,
  }
}
</script>

<template>
  <div flex="~ col gap4 sm:gap-6 items-center" py-6 select-none>
    <div
      class="circle-btn"
      flex="~ center"
      cursor-pointer relative w-15 h-15 b-rd-full
      border="1 grey-9 dark:grey-1"
      hover="bg-grey-4/50 dark:bg-grey-6/50"
      :class="{ liked, animating }"
      @click="handleLike"
      @mouseenter="isHover = true"
      @mouseleave="isHover = false"
    >
      <div
        :style="{ color: liked ? 'var(--grey-1)' : 'var(--grey-9)' }" v-html="likeIcon"
      />
      <!-- 彩带动画 -->
      <!-- <div
        v-if="liked && animating"
        absolute left-0 top-0 full
        pointer-events-none z-2
      >
        <span
          v-for="n in 24" :key="n"
          class="dot"
          absolute w-2 h-2 b-rd-full opacity-085
          :style="getConfettiStyle(n)"
        />
      </div> -->
    </div>
    <div v-if="count" flex="~ items-center gap-4" w-full>
      <span flex-1 h-1px bg-grey-5 />
      <span
        whitespace-normal text="grey-6 dark:grey-3"
        v-text="liked ? '你已赞' : `${count} 人点赞`"
      />
      <span flex-1 h-1px bg-grey-5 />
    </div>
  </div>
</template>

<style scoped>
.circle-btn {
  transition: background 0.2s, border 0.2s;
}

.circle-btn.liked {
  background: var(--grey-9);
  box-shadow: 0 2px 8px rgba(36, 104, 242, 0.12);
}

.circle-btn.animating {
  animation: pop 0.4s;
}

.dot {
  animation: confetti-fall 0.8s cubic-bezier(.62, -0.01, .58, 1.01);
  will-change: transform, opacity;
}

@keyframes pop {
  0% {
    transform: scale(1);
  }

  30% {
    transform: scale(1.15);
  }

  60% {
    transform: scale(0.95);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes confetti-fall {
  0% {
    opacity: 1;
    transform: scale(1) translate(0, 0) rotate(0deg);
  }

  60% {
    opacity: 1;
  }

  100% {
    opacity: 0;
    transform: scale(0.7) translate(var(--confetti-x, 0), var(--confetti-y, 0)) rotate(360deg);
  }
}
</style>
