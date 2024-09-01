<script setup lang="ts">
import moment from 'moment'
import type { IArticle } from 'shared/types/entities/article.interface'

const router = useRouter()
const { articleId } = useMyLocalStorage()

const articlesList = ref<IArticle[]>([])

async function getArticlesList() {
  try {
    const res = await getArticleListApi()
    if (res.length)
      articlesList.value = res
  }
  catch (error) { }
}

function goInfo(id: IArticle['id']) {
  articleId.value = id
  router.push({
    path: '/article',
    query: {
      id,
    },
  })
}

onBeforeMount(() => {
  getArticlesList()
})
</script>

<template>
  <div
    v-if="articlesList.length"
    full flex="~ col 1 gap6"
  >
    <div
      v-for="(articles, index) in articlesList.reverse()" :key="articles.id"
      class="article group" flex="~ col 1 gap4"
      cursor-pointer full b-rd-2 overflow-hidden
      @click="goInfo(articles.id)"
    >
      <div
        flex="~ 1 flex"
        :style="{ flexDirection: index % 2 ? 'row-reverse' : 'row' }"
      >
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
              class="abstract" line-clamp-2
              v-text="articles.abstract"
            />
            <div class="info" flex="~ justify-between">
              <div class="info_left" text-grey-5 flex="~ gap4">
                <div
                  v-if="articles.createTime"
                  v-text="moment(articles.createTime).format('YYYY-MM-DD')"
                />
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
        <div
          flex-0.5 h-40 overflow-hidden
          :style="{
            clipPath: index % 2
              ? 'polygon(0 0,92% 0,100% 100%,0 100%)'
              : 'polygon(0 0,100% 0,100% 100%,8% 100%)',
          }"
        >
          <img full :src="articles.articleCover">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.article{
  border:1px solid var(--grey-3);
  // box-shadow: 0 0 8px var(--grey-3);
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
      background-color: var(--grey-9);
      transition: all .5s;
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
          color: var(--grey-7);
        }
      }
    }
  }

  &:hover {
    // box-shadow: 0 0 8px var(--grey-4);

    img {
      transform: scale(1.2);
    }

    .title{
      color: var(--grey-9);
      &::after {
        width: 100%;
      }
    }
  }
}
</style>
