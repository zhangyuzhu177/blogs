<script setup lang="ts">
const { width } = useWindowSize()
const router = useRouter()

function jumpTo(path: string) {
  router.push(path)
}
</script>

<template>
  <q-btn flat round>
    <div w-6 h-6 i-ph:list-bullets-bold />
    <q-menu
      transition-show="scale"
      transition-hide="scale"
      :offset="width > 600 ? [0, 0] : [0, (600 - width) / 7.5]"
    >
      <q-list style="min-width: 100px">
        <q-item
          v-for="item in NAV" :key="item.id"
          v-close-popup clickable @click="jumpTo(item.path)"
        >
          <q-item-section>
            <div v-text="item.label" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>
