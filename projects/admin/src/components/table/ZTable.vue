<script setup lang="ts">
import { QTable } from 'quasar'
import type { QTableProps, QTableSlots } from 'quasar'

interface ZTableProps {
  rows: QTableProps['rows']
  cols: QTableProps['columns']
  loading?: boolean
  selected?: any[]
  /** 分页信息 */
  pagination?: QTableProps['pagination']
  /** 触发服务器请求 */
  onRequest?: QTableProps['onRequest']
  /** 是否固定表格第一列 */
  fixedFirstColumn?: boolean
  /** 是否固定表格最后一列 */
  fixedLastColumn?: boolean
  params?: Omit<QTableProps, 'rows' | 'columns' | 'loading' | 'selected' | 'pagination' | 'onRequest'>
}

const props = defineProps<ZTableProps>()
const emits = defineEmits(['update:selected', 'update:pagination'])

const { selected, pagination } = useVModels(props, emits)

const tableRef = ref<InstanceType<typeof QTable>>()
const ROWS_PER_PAGE_OPTIONS = [20, 80, 200, 500, 1000]

onMounted(() => {
  if (props.onRequest)
    tableRef.value?.requestServerInteraction()
})

/** 当前单元格的label */
const cellLabel = ref<string>()
/** 当前单元格的value */
const cellValue = ref<string>()

defineExpose({
  tableRef,
})
</script>

<template>
  <div full>
    <QTable
      ref="tableRef"
      v-model:selected="selected"
      v-model:pagination="pagination"
      class="z-table"
      :class="{
        'fixed-first-column': fixedFirstColumn,
        'fixed-last-column': fixedLastColumn,
      }"
      :rows="rows"
      :columns="cols"
      :loading="loading"
      :rows-per-page-options="ROWS_PER_PAGE_OPTIONS"
      virtual-scroll
      v-bind="params" flat full
      bg-grey-1 rounded-3 b="1px grey-3"
      @request="onRequest"
    >
      <template
        v-for="(_, slotName) of ($slots as Readonly<QTableSlots>)"
        :key="slotName"
        #[slotName]="prop"
      >
        <slot :name="slotName" v-bind="prop as any" />
      </template>
      <template #loading>
        <ZLoading :value="loading" />
      </template>
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
          v-text="value ?? '—'"
        />
      </template>
    </QTable>

    <ZDialog
      :model-value="!!cellValue || typeof cellValue === 'number'"
      :title="cellLabel ?? ''"
      :params="{
        persistent: false,
      }"
      @update:model-value="cellValue = undefined"
    >
      {{ cellValue }}
    </ZDialog>
  </div>
</template>

<style lang="scss" scoped>
.z-table {
  :deep() {
    .q-table__middle {
      thead {
        background: var(--grey-2);
        position: sticky;
        top: 0;
        z-index: 2;

        th.sortable {
          > .q-table__sort-icon {
            font-size: 16px;
            position: relative;
            bottom: 1px;
          }
        }
      }

      tr {
        height: 48px;

        th, td {
          height: auto;
          padding: 8px 16px;
          font-weight: 400;
          font-size: 14px;
          line-height: 20px;
          color: var(--grey-8);
          border-color: var(--grey-3);
          background: transparent;
          max-width: 260px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        th {
          font-weight: 500;
        }

        &.selected {
          td::after {
            display: none;
          }
        }
      }

      .q-checkbox .q-checkbox__inner {
        font-size: 36px;
      }
    }

    .q-table__top {
      background: var(--grey-2);
      border-bottom: 1px solid var(--grey-3);
    }

    .q-table__bottom {
      min-height: 40px;
      height: 40px;
      padding: 0 16px;
      color: var(--grey-8);
      font-size: 16px;

      .q-table__bottom-nodata-icon {
        font-size: 18px;
      }

      .q-table__control {
        .q-btn, .q-field__append {
          i {
            font-size: 16px;
          }
        }

        .q-field__append i {
          bottom: 1px;
        }
      }
    }
  }

  /** 固定表格第一列 */
  &.fixed-first-column {
    :deep(tr) {
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
  &.fixed-last-column {
    :deep(tr) {
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
