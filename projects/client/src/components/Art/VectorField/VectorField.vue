<script setup lang="ts">
import { isClient } from '@vueuse/core'

const canvasRef = ref<HTMLCanvasElement | null>(null)
const animationRef = ref<number | null>(null)

const mouse = ref<{ x: number | null; y: number | null; radius: number }>({
  x: null,
  y: null,
  radius: 100,
})

onMounted(() => {
  if (!isClient)
    return

  const canvas = canvasRef.value
  if (!canvas)
    return
  const ctx = canvas.getContext('2d')
  if (!ctx)
    return

  let width = window.innerWidth
  let height = window.innerHeight
  const numParticles = 1000
  const particles: { x: number; y: number; age: number }[] = []

  canvas.width = width
  canvas.height = height

  function resize() {
    width = window.innerWidth
    height = window.innerHeight
    if (canvas) {
      canvas.width = width
      canvas.height = height
    }
  }

  function handleMouseMove(e: MouseEvent) {
    if (!canvasRef.value)
      return
    const rect = canvasRef.value.getBoundingClientRect()
    mouse.value.x = e.clientX - rect.left
    mouse.value.y = e.clientY - rect.top
  }

  function handleMouseOut() {
    mouse.value.x = null
    mouse.value.y = null
  }

  window.addEventListener('resize', resize)
  window.addEventListener('mousemove', handleMouseMove)
  window.addEventListener('mouseout', handleMouseOut)

  // 初始化粒子
  for (let i = 0; i < numParticles; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      age: Math.random() * 100,
    })
  }

  // === Vector Field === v2.95 双旋涡中心版本 ===
  function vectorField(
    x: number,
    y: number,
    t: number,
    centerX: number,
    centerY: number,
    canvasWidth: number,
    canvasHeight: number,
  ) {
    const swirlStrengthMouse = 4.0
    const swirlStrengthCenter = 2.0
    const influenceRadiusMouse = 400
    const influenceRadiusCenter = 600
    const baseFlowAngle = Math.PI / 9
    const baseFlowSpeed = 0.2

    // 基础流动
    let vx = Math.cos(baseFlowAngle) * baseFlowSpeed
    let vy = Math.sin(baseFlowAngle) * baseFlowSpeed

    // 鼠标漩涡
    if (centerX !== null && centerY !== null) {
      const dx = x - centerX
      const dy = y - centerY
      const dist = Math.sqrt(dx * dx + dy * dy) || 0.001

      if (dist < influenceRadiusMouse) {
        const strength = (1 - dist / influenceRadiusMouse) * swirlStrengthMouse
        const swirlX = -dy / dist
        const swirlY = dx / dist
        vx += swirlX * strength
        vy += swirlY * strength
      }
    }

    // 中心漩涡
    const canvasCenterX = canvasWidth / 2
    const canvasCenterY = canvasHeight / 2
    const dxc = x - canvasCenterX
    const dyc = y - canvasCenterY
    const distCenter = Math.sqrt(dxc * dxc + dyc * dyc) || 0.001

    if (distCenter < influenceRadiusCenter) {
      const strengthCenter
        = (1 - distCenter / influenceRadiusCenter) * swirlStrengthCenter
      const swirlXCenter = dyc / distCenter
      const swirlYCenter = -dxc / distCenter
      vx += swirlXCenter * strengthCenter
      vy += swirlYCenter * strengthCenter
    }

    return { vx, vy }
  }

  // 绘制循环
  const draw = (t: number) => {
    if (!ctx || !canvas)
      return

    ctx.globalCompositeOperation = 'destination-out'
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
    ctx.fillRect(0, 0, width, height)
    ctx.globalCompositeOperation = 'source-over'

    for (const p of particles) {
      const centerX = mouse.value.x ?? width / 2
      const centerY = mouse.value.y ?? height / 2
      const v = vectorField(p.x, p.y, t, centerX, centerY, canvas.width, canvas.height)

      p.x += v.vx * 0.75
      p.y += v.vy * 0.75

      p.age++
      if (p.x < 0 || p.x > width || p.y < 0 || p.y > height || p.age > 100) {
        p.x = Math.random() * width
        p.y = Math.random() * height
        p.age = 0
      }

      const speed = Math.sqrt(v.vx * v.vx + v.vy * v.vy)
      const speedNorm = Math.min(speed / 5.0, 1)
      const r = 128 * (1 - speedNorm)
      const g = 128
      const b = 128
      ctx.fillStyle = `rgba(${r},${g},${b}, 0.5)`

      ctx.beginPath()
      ctx.arc(p.x, p.y, 0.8, 0, Math.PI * 2)
      ctx.fill()
    }

    animationRef.value = requestAnimationFrame(draw)
  }

  animationRef.value = requestAnimationFrame(draw)

  // 清理
  onBeforeUnmount(() => {
    window.removeEventListener('resize', resize)
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mouseout', handleMouseOut)
    if (animationRef.value)
      cancelAnimationFrame(animationRef.value)
  })
})
</script>

<template>
  <div className="flex flex-col gap-8 justify-center box-content h-full flex-1">
    <div className="absolute -z-10 inset-0 w-full h-full overflow-x-clip [mask-size:100%_100%] [mask-repeat:no-repeat] [mask-position:center_top] [mask-composite:exclude] [mask-mode:alpha] [mask-origin:content-box] [mask-clip:content-box] [mask-border-mode:match-source]  [mask-image:linear-gradient(to_bottom,red,transparent_88%)]">
      <div className="bg-grid-dots rounded-full w-[50rem] h-[50rem] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(red,transparent_80%)]" />
    </div>

    <canvas
      ref="canvasRef"
      class="
        absolute animate-fade-in top-0 left-0 w-screen h-screen -z-10 pointer-events-none
        [mask-size:100%_100%] [mask-repeat:no-repeat] [mask-position:center_top]
        [mask-composite:exclude] [mask-mode:alpha] [mask-origin:content-box]
        [mask-clip:content-box] [mask-border-mode:match-source]
        [mask-image:radial-gradient(red,transparent_80%)]
      "
    />
  </div>
</template>

<style scoped>
canvas {
  display: block;
}
</style>
