<script setup lang="ts">
import { MdPreview } from 'md-editor-v3'

const { page } = useClientApp()
</script>

<template>
  <div flex="~ col gap-4" lg="gap-6" style="">
    <div
      relative p-2 pt-19
      flex="~ col gap-4 items-center"
    >
      <div
        absolute-x-center top--15
        w-30 h-30 cursor-pointer
      >
        <q-img
          v-if="page?.avatar" class="avatar"
          loading="lazy"
          b-rd="50%" full :src="page?.avatar"
        />
      </div>
      <div v-if="page?.name" v-text="page?.name" />
      <div flex="~ gap-4">
        <a v-if="page?.phone" :href="`tel:${page.phone}`" target="_blank">
          <div transition-all hover:bg="grey-5" size-6 i-mingcute:phone-line />
        </a>
        <a v-if="page?.email" :href="`mailto:${page.email}`" target="_blank">
          <div transition-all hover:bg="grey-5" size-6 i-mingcute:mail-line />
        </a>
        <a v-if="page?.github" :href="page?.github" target="_blank">
          <div transition-all hover:bg="grey-5" size-6 i-mingcute:github-line />
        </a>
      </div>
      <div v-if="page?.motto">
        <pre v-text="page?.motto" />
      </div>
    </div>
    <div v-if="page?.content">
      <MdPreview
        :model-value="page?.content"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.avatar {
  &:hover {
    transform: rotate(666turn);
    transition-delay: 1s;
    transition-property: transform;
    transition-duration: 59s;
    transition-timing-function: cubic-bezier(0.34, 0, 0.84, 1);
  }
}

:deep(.q-btn){
  .q-focus-helper {
    display: none;
  }

  .q-ripple {
    display: none;
  }

  .q-tab__indicator{
    display: none;
  }
}

:deep(.md-editor) {
  background-color: transparent !important;

  .md-editor-preview-wrapper{
    padding: 0;
    .md-editor-preview {
      h1 {
        color: var(--grey-9);
      }
      p {
        color: var(--grey-9);
      }
    }
  }
}
</style>
