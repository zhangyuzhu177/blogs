<script setup lang="ts">
import moment from 'moment'

import type { IArticle } from 'shared/types/entities/article.interface'

const loading = ref(false)
const articlesList = ref<IArticle[]>([])

async function getArticlesList() {
  loading.value = true
  try {
    const res = await getArticleListApi()
    if (res.length)
      articlesList.value = res
  }
  catch (error) { }
  finally {
    loading.value = false
  }
}

onMounted(() => {
  getArticlesList()
})
</script>

<template>
  <div full flex="~ col 1 gap4">
    <ZLoading :value="loading" />
    <template v-if="articlesList.length">
      <div
        v-for="articles in articlesList" :key="articles.id"
        class="article group" flex="~ col 1 gap4"
        cursor-pointer full b-rd-4 overflow-hidden
      >
        <div flex="~ 1 flex">
          <div flex-0.5 overflow-hidden>
            <img w-full h-50 :src="articles.articleCover" alt="">
          </div>
          <div p4 flex="~ col 1 gap2">
            <div flex>
              <h3
                class="title"
                whitespace-nowrap relative
                transition="300"
                v-text="articles.title"
              />
            </div>
            <div flex="~ 1 col gap2 justify-between">
              <div
                class="abstract"
                line-clamp-3
                v-text="articles.abstract"
              />
              <div class="info" flex="~ justify-between">
                <div class="info_left" text-grey-5 flex="~ gap4">
                  <div v-if="articles.createTime" v-text="moment(articles.createTime).format('YYYY-MM-DD')" />
                  <div v-if="articles.pageView" flex="~ items-center gap1">
                    <div i-mdi:eye-outline />
                    <div v-text="articles.pageView" />
                  </div>
                </div>
                <div class="info_right" flex="~ gap4">
                  <div
                    transition="300"
                    hover:text-grey-8
                    v-text="articles.category"
                  />
                  <div
                    transition="300"
                    hover:text-grey-8
                    v-text="articles.tags"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped lang="scss">
.article{
  box-shadow: 0 0 8px var(--grey-3);
  transition: all .3s;

  img {
    transition: transform .3s;
  }

  .title {
    color: var(--grey-7);
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: var(--grey-8);
      transition: all .3s;
    }
  }

  .abstract{
    color: var(--grey-7);
  }

  .info {
    .info_left {
      color: var(--grey-5);
    }

    .info_right {
      color: var(--grey-5);
      div {
        &:hover {
          color: var(--grey-8);
        }
      }
    }
  }

  &:hover {
    box-shadow: 0 0 8px var(--grey-4);

    img {
      transform: scale(1.2);
    }

    .title{
      color: var(--grey-8);
      &::after {
        width: 100%;
      }
    }
  }
}
</style>
