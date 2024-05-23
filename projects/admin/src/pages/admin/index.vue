<script setup lang="ts">
import AdminRole from '~/views/admin/AdminRole.vue'
import AssignRole from '~/views/admin/AssignRole.vue'

const { active, menu } = useMenu()
</script>

<template>
  <div v-if="menu?.length">
    <AdminRole v-if="active === menu[0].id" />
    <AssignRole v-if="active === menu[1].id" />
  </div>
</template>

<style  scoped></style>

<route lang="yaml">
meta:
  layout: home
  </route>
