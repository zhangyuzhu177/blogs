<script setup lang="ts">
import { PATTERN_BACKGROUND_DIRECTION, PATTERN_BACKGROUND_SPEED, PATTERN_BACKGROUND_VARIANT } from '../../components/Art/Background/pattern'
</script>

<template>
  <ArtPattern
    :animate="true"
    :direction="PATTERN_BACKGROUND_DIRECTION.TopRight"
    :variant="PATTERN_BACKGROUND_VARIANT.Dot"
    class="flex h-full w-full items-center justify-center"
    :speed="PATTERN_BACKGROUND_SPEED.Slow"
  >
    <p
      class="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-5xl"
    >
      Dot Background
    </p>
  </ArtPattern>
</template>

<route lang="yaml">
meta:
  layout: home
</route>
