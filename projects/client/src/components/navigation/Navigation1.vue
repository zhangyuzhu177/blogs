<script setup lang="ts">
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
    padding: 0 24px !important;
    transition: all .3s;

    // &::after {
    //   position: absolute;
    //   content: '';
    //   top: 5%;
    //   left: 0;
    //   width: 100%;
    //   height: 90%;
    //   border: 1px solid var(--grey-1);
    //   background: rgba($color: var(--grey-1), $alpha: 0.2);
    //   border-radius: 8px;
    //   display: none;
    //   transition: opacity .5s;
    //   z-index: -1;
    // }

    // &:hover {
    //   &::after {
    //     display: block;
    //   }
    // }

    .q-focus-helper {
      display: none;
      border-radius: 10px !important;
      border: 1px solid var(--grey-3) !important;
    }

    .q-tab__label {
      font-size: 16px;
      line-height: 24px;
    }

    .q-ripple {
      display: none;
      border-radius: 10px !important;
    }

    .q-tab__indicator{
      display: none;
    }
  }
}
</style>
