<script lang="ts" setup>
import { cloneDeep } from 'lodash'
import { useVModel } from '@vueuse/core'
import { ROWS_PER_PAGE_OPTIONS } from 'utils'
import { computed, onMounted, ref, watch } from 'vue'
import { Notify, QTable, copyToClipboard } from 'quasar'
import type { QTableColumn, QTableProps, QTableSlots } from 'quasar'

import '../checkbox/ZCheckbox.vue'
import ZDialog from '../dialog/ZDialog.vue'
import ZLoading from '../loading/ZLoading.vue'

export interface ZTableProps {
  /**
   * 要显示的表格行
   */
  rows?: QTableProps['rows']
  /**
   * 表格列定义（对象数组）
   */
  cols?: QTableProps['columns']
  /**
   * 是否显示操作列（操作列的 ID）
   *
   * 当该参数为 `true` 时，默认操作列的 `field` 为 `id`
   *
   * 当显示操作列时，始终固定表格的最后一列
   */
  action?: boolean | string
  /**
   * 操作列单元格的默认对齐方式
   *
   * 仅当 `action` 参数为 `true` 或为字符串时生效
   *
   * 可选值：`left`、`right`、`center`
   *
   * 默认值：`left`
   */
  actionAlign?: QTableColumn['align']
  /**
   * 加载中
   */
  loading?: boolean
  /**
   * 用于过滤表格的字符串
   */
  filter?: QTableProps['filter']
  /**
   * 用户选择的类型
   *
   * 可选值：`single`、`multiple`、`none`
   *
   * 默认值：`none`
   */
  selection?: QTableProps['selection']
  /**
   * 用户选择的表格行
   */
  selected?: QTableProps['selected']
  /**
   * 表格分页信息
   */
  pagination?: QTableProps['pagination']
  /**
   * 单元格的默认对齐方式
   *
   * 可选值：`left`、`right`、`center`
   *
   * 默认值：`center`
   */
  align?: QTableColumn['align']
  /**
   * 空单元格的占位符
   *
   * 默认值：`-`
   */
  placeholder?: string
  /**
   * 没有可用数据时显示的文本
   *
   * 默认值：`暂无数据`
   */
  noDataLabel?: QTableProps['noDataLabel']
  /**
   * 可见列
   */
  visibleColumns?: QTableProps['visibleColumns']
  /**
   * 是否固定表格第一列
   */
  fixedFirstCol?: boolean
  /**
   * 是否固定表格最后一列
   */
  fixedLastCol?: boolean
  /**
   * 是否显示边框
   *
   * 默认值：`true`
   */
  border?: boolean
  /**
   * 触发服务器请求
   */
  onRequest?: QTableProps['onRequest']
  /**
   * 其他参数
   *
   * 继承自 `quasar` 的 `QTableProps`
   */
  params?: Omit<
    QTableProps,
    'rows' | 'columns' | 'loading' | 'filter' | 'binaryStateSort' | 'selection'
    | 'selected' | 'pagination' | 'noDataLabel' | 'visibleColumns' | 'onRequest'
  >
}

const props = withDefaults(defineProps<ZTableProps>(), {
  align: 'center',
  placeholder: '-',
  noDataLabel: '暂无数据',
  border: true,
})
const emits = defineEmits<{
  /**
   * 更新用户选择的表格行
   */
  'update:selected': [ZTableProps['selected']]
  /**
   * 更新表格分页信息
   */
  'update:pagination': [ZTableProps['pagination']]
}>()

const selected = useVModel(props, 'selected')

const tableRef = ref<InstanceType<typeof QTable>>()

/** 表格列 */
const columns = computed(() => {
  const { cols, action, align, actionAlign } = props
  const columns = cloneDeep(cols)
  if (action) {
    columns?.push({
      name: 'action',
      label: '操作',
      field: typeof action === 'string' ? action : 'id',
      align: actionAlign ?? 'left',
      required: true,
    })
  }
  return columns?.map(col => ({ ...col, align: col.align ?? align }))
})

/** 内部表格分页信息 */
const internalPagination = ref<QTableProps['pagination']>()
/** 表格分页信息 */
const pagination = computed(() => props.pagination ?? internalPagination.value)

// 切换页码，表格滚动至顶部
watch(
  () => pagination.value?.page,
  () => {
    (tableRef.value?.$el as HTMLElement)
      ?.querySelector('.q-table__middle')?.scrollTo(0, 0)
  },
)

onMounted(() => {
  if (props.onRequest)
    tableRef.value?.requestServerInteraction()
})

/** 当前单元格的label */
const cellLabel = ref<string>()
/** 当前单元格的value */
const cellValue = ref<string>()

/**
 * 复制文本
 */
function copyText() {
  copyToClipboard(`${cellLabel.value}：${cellValue.value}`)
  Notify.create({
    type: 'success',
    message: '已复制到剪切板',
  })
}

defineExpose({
  tableRef,
})
</script>

<template>
  <div>
    <QTable
      ref="tableRef"
      v-model:selected="selected"
      :pagination
      class="z-table"
      :class="{
        'fixed-first-col': fixedFirstCol,
        'fixed-last-col': fixedLastCol || action,
      }"
      :rows :columns :loading :filter
      :selection :no-data-label :visible-columns
      :rows-per-page-options="ROWS_PER_PAGE_OPTIONS"
      virtual-scroll binary-state-sort flat full relative
      bg-grey-1 rounded-10px b-grey-3
      :b="border ? '1' : 'none'"
      v-bind="props.params"
      @request="onRequest"
      @update:pagination="val => {
        internalPagination = val
        emits('update:pagination', val)
      }"
    >
      <!-- 表格插槽 -->
      <template
        v-for="(_, slotName) of ($slots as Readonly<QTableSlots>)"
        :key="slotName"
        #[slotName]="prop"
      >
        <slot :name="slotName" v-bind="prop" />
      </template>

      <!-- 加载中 -->
      <template #loading>
        <ZLoading :model-value="loading" />
      </template>

      <!-- 单元格 -->
      <template #body-cell="{ col, value }">
        <q-td
          cursor-default
          :style="{
            textAlign: col.align,
          }"
          @dblclick="() => {
            cellLabel = col.label
            cellValue = value
          }"
          v-text="value ?? placeholder"
        />
      </template>
    </QTable>

    <ZDialog
      :model-value="!!cellValue || typeof cellValue === 'number'"
      :title="cellLabel"
      footer confirm-text="复制"
      whitespace-pre-wrap
      @update:model-value="cellValue = undefined"
      @ok="copyText"
    >
      {{ cellValue }}
    </ZDialog>
  </div>
</template>

<style lang="scss">
.z-table {
  .q-table__middle {
    thead {
      background: var(--grey-2);
      position: sticky;
      top: 0;
      z-index: 2;

      tr {
        height: 44px;

        th {
          font-size: 12px;
          line-height: 18px;
          font-weight: 500;
          color: var(--grey-7);

          &.sortable {
            > .q-table__sort-icon {
              font-size: 12px;
              bottom: 1px;
            }
          }
        }
      }
    }

    tbody {
      tr {
        height: 48px;

        td {
          font-size: 14px;
          line-height: 20px;
          color: var(--grey-9);
          border-color: var(--grey-3);
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;

          &::before, &::after {
            display: none;
          }
        }

        &:hover {
          td {
            background-color: var(--grey-2);
          }
        }
      }
    }
  }

  .q-table__top {
    background: var(--grey-2);
    border-bottom: 1px solid var(--grey-3);
  }

  .q-table__bottom {
    min-height: 40px;
    padding: 0 24px;
    color: var(--grey-7);
    font-size: 14px;
    line-height: 20px;
    gap: 0 16px;

    .q-table__bottom-nodata-icon {
      font-size: 14px;
      color: var(--grey-6);
    }

    .q-table__control {
      .q-table__bottom-item {
        margin-right: 6px;
      }

      .q-field__control {
        min-height: 28px;

        .q-field__native {
          min-height: 28px;
        }

        .q-field__append {
          height: 28px;
        }
      }

      .q-btn {
        min-width: 28px;
        min-height: 28px;

        &:nth-child(2) {
          margin-left: 12px;
        }
      }

      .q-btn, .q-field__append {
        i {
          font-size: 14px;
          color: var(--grey-6);
        }

        &.disabled {
          opacity: 1 !important;

          i {
            color: var(--grey-4);
          }
        }
      }
    }
  }

  /** 固定表格第一列 */
  &.fixed-first-col {
    tr {
      > th, > td {
        &:first-child {
          position: sticky;
          left: 0;
          z-index: 1;
        }
      }

      > th:first-child {
        background-color: var(--grey-2);
      }

      > td:first-child {
        background-color: var(--grey-1);
      }
    }
  }

  /** 固定表格最后一列 */
  &.fixed-last-col {
    tr {
      > th, > td {
        &:last-child {
          position: sticky;
          right: 0;
          z-index: 1;
        }
      }

      > th:last-child {
        background-color: var(--grey-2);
      }

      > td:last-child {
        background-color: var(--grey-1);
      }
    }
  }
}
</style>
