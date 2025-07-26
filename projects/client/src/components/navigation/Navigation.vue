<script setup lang="ts">
import { MENU } from '~/constants/menu'

const tab = ref(MENU[0].to)
</script>

<template>
  <q-tabs v-model="tab" class="nav" inline-label>
    <q-route-tab
      v-for="item in MENU "
      :key="item.to"
      :name="item.to"
      :label="item.label"
      :to="item.to"
      exact
    />
  </q-tabs>
</template>

<style scoped lang="scss">
.nav {
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
        transition: all .3s;
        font-weight: normal;

        &:hover {
          font-weight: bold;
        }
      }

      .q-ripple {
        display: none;
      }

      .q-tab__indicator{
        display: none;
      }
    }

    .q-tab--active {
      color: var(--grey-9);

      .q-tab__content {

        .q-tab__label{
          font-weight: bold !important;
        }
      }
    }
  }

}
</style>
