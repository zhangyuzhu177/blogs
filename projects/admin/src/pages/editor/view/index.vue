<script setup lang="ts">
import { QScrollArea } from 'quasar'

import View from '~/views/editor/view/index.vue'
</script>

<template>
  <div class="flex flex-col full">
    <QScrollArea
      class="disable-horizontal-scroll "
      flex-1
    >
      <View />
    </QScrollArea>
  </div>
</template>

<route lang="yaml">
# meta:
#   layout: home
</route>
