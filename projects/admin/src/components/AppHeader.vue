<script lang="ts" setup>
const { active, menu } = useMenu()

/** 当前可用菜单 */
const currenMenu = computed(() => menu.value?.filter(v => v.flag))

watch(
  currenMenu,
  (newVal) => {
    if (newVal?.length) {
      if (!newVal.find(v => v.id === active.value))
        active.value = newVal[0].id
    }
    else {
      active.value = undefined
    }
  },
  {
    immediate: true,
  },
)
</script>

<template>
  <q-tabs
    v-if="currenMenu?.length"
    v-model="active"
    bg-grey-1 p="y2 x10" b-b="1px grey-3"
  >
    <q-tab
      v-for="item in currenMenu"
      :key="item.id"
      :name="item.id"
      opacity100 p="y3 x6" flex-1
      rounded-2
      @click="active = item.id"
    >
      <div
        text-base font-600
        v-text="item.label"
      />
    </q-tab>
  </q-tabs>
</template>

<style lang="scss" scoped>
.q-tabs {
  :deep() {
    .q-tabs__content {
      gap: 10px;
      justify-content: stretch;

      @media (min-width: 760px) {
        gap: 20px;
      }

      @media (min-width: 900px) {
        gap: 30px;
      }

      @media (min-width: 1360px) {
        gap: 40px;
      }

      .q-tab {
        &.q-tab--inactive {
          color: var(--grey-5);
        }

        .q-tab__content {
          padding: 0;
        }

        &:hover .q-focus-helper {
          &::after {
            opacity: 0.6;
          }
        }

        .q-tab__indicator {
          display: none;
        }
      }
    }

    .q-tabs__arrow {
      font-size: 16px;
    }
  }
}
</style>
