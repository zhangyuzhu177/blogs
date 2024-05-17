<script setup lang="ts">
import { useQuasar } from 'quasar'

const $q = useQuasar()
</script>

<template>
  <div w-full h-16 flex="~ gap4" justify-end px-6 items-center>
    <div cursor-pointer i-ph:magnifying-glass-bold />
    <div cursor-pointer i-ph:sun-bold @click="$q.dark.toggle()" />
    <div cursor-pointer i-ph:github-logo-bold />
  </div>
</template>
