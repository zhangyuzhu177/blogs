<script setup lang="ts">

const { adminMenu } = useRole()
</script>

<template>
  <div flex="~ col gap1">
    <RouterLink
      v-for="item in adminMenu"
      :key="item.to"
      :to="item.to!"
    >
      <MenuItem
        :label="item.name"
        :icon="item.to!.substring(1)"
        :active="$route.path === item.to"
      />
    </RouterLink>
  </div>
</template>
