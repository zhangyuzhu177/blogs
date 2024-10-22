<script setup lang="ts">
interface Props {
  height?: string
}

withDefaults(defineProps<Props>(), {
  height: '600px',
})

const canvas = ref<HTMLCanvasElement>()
const particles: any = []

onMounted(() => {
  const ctx = canvas.value!.getContext('2d')!
  const particleCount = 100
  class Particle {
    x: number
    y: number
    size: number
    speedY: number
    gravity: number
    alpha: number
    constructor(x: number, y: number) {
      this.x = x
      this.y = y
      this.size = Math.random() * 5 + 2
      this.speedY = Math.random() * -3 - 1 // 向上的速度
      this.gravity = 0.1 // 重力加速度
      this.alpha = 1 // 透明度
    }

    update() {
      this.y += this.speedY // 更新y坐标
      this.speedY += this.gravity // 应用重力
      this.alpha -= 0.01 // 渐变透明

      // Reset the particle if it's out of canvas
      if (this.alpha <= 0)
        this.reset()
    }

    reset() {
      this.x = Math.random() * canvas.value!.width // 随机x坐标
      this.y = canvas.value!.height // 重置到底部
      this.size = Math.random() * 2 + 2 // 随机大小
      this.speedY = Math.random() * -3 - 1 // 随机速度
      this.alpha = 1 // 透明度重置
    }

    draw() {
      ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})` // 白色水滴
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  for (let i = 0; i < particleCount; i++)
    particles.push(new Particle(Math.random() * canvas.value!.width, canvas.value!.height))

  function animate() {
    ctx.clearRect(0, 0, canvas.value!.width, canvas.value!.height) // 清空画布

    for (let i = 0; i < particles.length; i++) {
      particles[i].update() // 更新粒子
      particles[i].draw() // 绘制粒子
    }

    requestAnimationFrame(animate) // 循环调用
  }

  animate()
})
</script>

<template>
  <div full>
    {{ height }}
    <canvas ref="canvas" w-full :h="height" />
  </div>
</template>
