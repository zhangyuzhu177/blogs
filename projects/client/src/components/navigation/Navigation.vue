<script setup lang="ts">
import { NAV } from '~/constants/nav'

const tab = ref('home')
</script>

<template>
  <q-tabs v-model="tab" inline-label>
    <q-route-tab
      v-for="item in NAV"
      :key="item.id"
      :name="item.id"
      :label="item.label"
      :to="item.path"
      exact
    />
  </q-tabs>
</template>

<style scoped lang="scss">
:deep(.q-tabs__content) {
  gap: 8px;

  .q-tab {
    padding: 0 8px !important;
    transition: all .3s;

    .q-focus-helper {
      display: none;
    }

    .q-tab__label {
      font-size: 16px;
      line-height: 24px;
      font-weight: 600;
    }

    .q-ripple {
      display: none;
    }

    .q-tab__indicator{
      display: none;
    }
  }
}
</style>
