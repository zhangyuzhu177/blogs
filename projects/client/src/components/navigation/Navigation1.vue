<script setup lang="ts">
const tab = ref('home')
</script>

<template>
  <q-tabs v-model="tab" inline-label>
    <q-route-tab v-for="item in NAV" :key="item.id" :name="item.id" :label="item.label" :to="item.path" exact />
  </q-tabs>
</template>

<style scoped lang="scss">
:deep(.q-tabs__content) {
  gap: 16px;

  .q-tab {
    padding: 0 24px !important;

    .q-focus-helper {
      border-radius: 10px !important;
    }

    .q-tab__label {
      font-size: 16px;
      line-height: 24px;
    }

    .q-ripple {
      border-radius: 10px !important;
    }
  }
}
</style>
