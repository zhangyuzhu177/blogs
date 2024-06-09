<script setup lang="ts">
const value = ref('')
const title = ref('')
const img = ref<File>()

const loading = ref(false)
const publish = ref(false)
const active = ref('')

function callback() {

}
</script>

<template>
  <div full flex="~ col gap-4">
    <ZLoading :value="loading" />
    <div flex gap6 justify-between>
      <ZInput
        v-model="title" borderless
        flex-1
        placeholder="输入文章标题..."
      />
      <ZBtn @click="publish = true">
        <div i-ph:navigation-arrow-bold />
        发布文章
      </ZBtn>
    </div>
    <!-- 文章内容 -->
    <v-md-editor v-model="value" height="100%" />

    <!-- 发布文章  -->
    <ZDialog
      v-model="publish"
      title="发布文章"
      footer scroll
      :wrapper-style="{
        width: '600px',
        maxWidth: '600px',
      }"
      @ok="callback"
    >
      <div flex="~ col gap6">
        <div flex="~ col gap2">
          分类
          <div flex="~ gap-4 wrap">
            <Tag1
              v-for="i in CLASSIFY" :key="i.id" w-30
              :tag="i" :active="active" @click="active = i.id"
            />
          </div>
        </div>
        <div flex="~ col gap2">
          文章标签
          <ZInput
            v-model="title"
            flex-1
            placeholder="输入文章标题..."
          />
        </div>
        <div flex="~ col gap2">
          文章封面
          <ZUpload
            v-model="img"
            type="image"
            accept="image/*"
            w-50 b-rd-4
          >
            <div b-rd-4 full h-30 flex-center border="1px dashed gray-5">
              <div text="6 grey-5" i-ph:plus />
            </div>
          </ZUpload>
        </div>
        <div flex="~ col gap2">
          文章类型
          <div flex="~ gap-4 wrap">
            <Tag1
              v-for="i in ARTICLE_CLASS" :key="i.id" w-30
              :tag="i" :active="active" @click="active = i.id"
            />
          </div>
        </div>
        <div flex="~ col gap2">
          转载连接
          <ZInput
            v-model="title"
            flex-1
            placeholder="输入文章标题..."
          />
        </div>
        <div flex="~ col gap2">
          发布方式
          <div flex="~ gap-4 wrap">
            <Tag1
              v-for="i in BT" :key="i.id" w-30
              :tag="i" :active="active" @click="active = i.id"
            />
          </div>
        </div>
      </div>
    </ZDialog>
  </div>
</template>

<style scoped lang="scss">

</style>
