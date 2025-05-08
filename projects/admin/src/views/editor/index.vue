<script setup lang="ts">
import { PermissionType } from 'types'

type Type = 'add' | 'edit' | 'view'

const route = useRoute()
const { hasPermission } = useUser()

/** 是否可添加 */
const isCreate = hasPermission(PermissionType.ARTICLE_PUBLISH)
/** 是否可便捷 */
const isUpdate = hasPermission(PermissionType.ARTICLE_UPDATE)

/** 操作类型 */
const type = ref<Type>('add')

onBeforeMount(() => {
  console.log(route.query)
})
</script>

<template>
  <div class="" p-4 flex="~ justify-center">
    <div lg="w-1024px" w-full flex="~ justify-end">
      <ZBtn label="保存">
        <template #left>
          <div size-5 i-mingcute:save-2-line />
        </template>
      </ZBtn>
    </div>
  </div>
</template>

<style scoped></style>
