<script setup lang="ts">
import { PermissionType } from 'shared/types/enum/permission.enum'
import moment from 'moment'
import { Notify } from 'quasar'
import type { QTableColumn, QTableProps } from 'quasar'
import type { IArticle } from 'shared/types/entities/article.interface'
import UpdateDialog from './UpdateDialog.vue'
import ZTable from '~/components/table/ZTable.vue'

const { adminRole } = useUser()

const zTable = ref<InstanceType<typeof ZTable>>()
const loading = ref(false)
const select = ref('')
const update = ref(false)
const article = ref<IArticle>()
const deleteDialog = ref(false)
const deleteId = ref<IArticle['id']>('')
/** 表格列 */
const cols = reactive<QTableColumn<IArticle>[]>([
  {
    name: 'title',
    label: '文章标题',
    field: 'title',
  },
  {
    name: 'category',
    label: '文章分类',
    field: 'category',
  },
  {
    name: 'tags',
    label: '文章标签',
    field: 'tags',
  },
  {
    name: 'pageView',
    label: '文章访问量',
    field: 'pageView',
  },
  {
    name: 'pageView',
    label: '发布时间',
    field: row => moment(row.createTime).format('YYYY-MM-DD'),
  },
  {
    name: 'status',
    label: '文章状态',
    field: 'status',
  },
  {
    name: 'operation',
    label: '操作',
    field: 'id',
  },
])
/** 表格行 */
const rows = ref<QTableProps['rows']>([])
/** 表格分页信息 */
const pagination = {
  rowsPerPage: 0,
}

async function queryArticleList() {
  loading.value = true
  try {
    const data = await getArticleListApi()
    rows.value = data
  }
  catch (e) {}
  finally {
    loading.value = false
  }
}

const filterRows = computed(() => {
  if (select.value)
    return rows.value.filter(row => row.title.includes(select.value))
  else
    return rows.value
})

function updateArticle(val: IArticle['id']) {
  update.value = true
  article.value = rows.value.find(row => row.id === val)
}

async function deleteArticle() {
  loading.value = true
  try {
    const res = await deleteArticleApi(deleteId.value)
    if (res) {
      Notify.create({
        type: 'success',
        message: '删除成功',
      })
      queryArticleList()
    }
  }
  catch (error) {}
  finally {
    loading.value = false
  }
}

onMounted(() => {
  cols.forEach(col => col.align = 'center')
})
</script>

<template>
  <div full flex="~ col gap4">
    <ZLoading :value="loading" />
    <div w-full flex justify-end>
      <ZInput
        v-model="select"
        class="rounded"
        placeholder="输入文章标题搜索"
        :params="{
          debounce: 500,
        }"
        size="medium"
        w80
      >
        <template #prepend>
          <div w5 h5 i-mingcute:search-line />
        </template>
      </ZInput>
    </div>

    <ZTable
      ref="zTable"
      v-model:pagination="pagination"
      :cols="cols"
      :rows="filterRows"
      :params="{
        noDataLabel: '暂无文章信息',
        binaryStateSort: true,
        hideBottom: filterRows.length ? true : false,
      }"
      flex-1 h0
      fixed-first-column
      fixed-last-column
      @request="queryArticleList"
    >
      <template #body-cell-operation="{ row }">
        <q-td flex-center gap2 text-center>
          <ZBtn
            v-if="hasIntersection(
              adminRole ?? [],
              [
                PermissionType.ARTICLE_UPDATE,
              ],
            )"
            label="编辑" size="small"
            @click="updateArticle(row.id)"
          />
          <ZBtn
            v-if="hasIntersection(
              adminRole ?? [],
              [
                PermissionType.ARTICLE_DELETE,
              ],
            )"
            label="删除" size="small"
            color="alerts-error"
            @click="() => {
              deleteDialog = true
              deleteId = row.id
            }"
          />
        </q-td>
      </template>
    </ZTable>

    <!-- 编辑文章 -->
    <UpdateDialog
      v-model="update"
      :article="article!"
      @submit="queryArticleList"
    />

    <!-- 删除文章 -->
    <ZDialog
      v-model="deleteDialog"
      title="删除文章"
      footer
      @ok="deleteArticle"
    >
      该操作将删除此文章，是否继续？
    </ZDialog>
  </div>
</template>
