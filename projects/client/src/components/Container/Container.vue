<script setup lang="ts">
import { PATTERN_BACKGROUND_DIRECTION, PATTERN_BACKGROUND_SPEED, PATTERN_BACKGROUND_VARIANT } from '../Art/Background/pattern'
</script>

<template>
  <ArtPattern
    :animate="true"
    :direction="PATTERN_BACKGROUND_DIRECTION.TopRight"
    :variant="PATTERN_BACKGROUND_VARIANT.Dot"
    class="flex h-full w-full" bg-pink
    :speed="PATTERN_BACKGROUND_SPEED.Slow"
  >
    <div
      w-full py-18 relative
      flex="~ 1 justify-center"
    >
      <div
        flex="~ 1 col"
        lg="max-w-1080px px-0" sm="px-6"
        px-4
      >
        <slot />
        <ScrollTop />
      </div>
    </div>
  </ArtPattern>
</template>
