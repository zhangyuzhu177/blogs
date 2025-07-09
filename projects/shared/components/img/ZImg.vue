<script lang="ts" setup>
import { randomId } from 'utils'
import type { CSSProperties } from 'vue'
import type { vPreview } from 'vue3-image-preview'
import { isClient, useVModel } from '@vueuse/core'
import { onBeforeMount, ref, shallowRef } from 'vue'

export interface ZImgProps {
  /**
   * 图片列表绑定的值
   */
  modelValue?: string | any[]
  /**
   * 图片 `src` 的格式化函数
   */
  onSrcFormat?: (_src: any) => string
  /**
   * 是否只读图片列表
   */
  readonly?: boolean
  /**
   * 单个图片的宽度
   */
  width?: number | string
  /**
   * 单个图片的高度
   */
  height?: number | string
  /**
   * 单个图片的样式
   */
  itemStyle?: CSSProperties
  /**
   * 图片的填充方式
   *
   * 可选值：`contain`、`cover`、`fill`、`none`、`scale-down`
   *
   * 默认值：`contain`
   */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down'
}

const props = withDefaults(defineProps<ZImgProps>(), {
  width: 80,
  height: 80,
  objectFit: 'contain',
})
defineEmits<{
  /**
   * 更新图片列表绑定的值
   */
  'update:modelValue': [ZImgProps['modelValue']]
}>()

const zImg = ref<HTMLDivElement>()

const value = useVModel(props, 'modelValue')

const vPreviewDirective = shallowRef<typeof vPreview>()
if (isClient) {
  import('vue3-image-preview').then((module) => {
    vPreviewDirective.value = module.vPreview
  })
}

const name = ref<string>()

onBeforeMount(() => {
  name.value = randomId()
})

/**
 * 预览图片
 */
function previewImages(index: number) {
  const imgs = zImg.value?.querySelectorAll('img')
  imgs?.item(index)?.click()
}
</script>

<template>
  <div
    v-if="value?.length && vPreviewDirective"
    ref="zImg"
    class="z-img"
    flex="~ wrap gap2"
  >
    <div
      v-for="
        (item, index) in Array.isArray(value)
          ? value
          : (value ? [value] : [])
      "
      :key="index"
      class="group"
      rounded-6px overflow-hidden relative
      bg-grey-2 object-contain cursor-pointer
      :style="{
        width: `${width}px`,
        height: `${height}px`,
        ...itemStyle,
      }"
      @click="previewImages(index)"
    >
      <img
        v-preview-directive:name="name"
        full :style="{ objectFit }"
        :src="onSrcFormat?.(item) ?? item"
      >
      <div
        v-if="!readonly"
        absolute inset-0 bg-black-3
        hidden group-hover:block
      >
        <div
          absolute top-0 right-0 p2px
          rounded-bl-6px cursor-pointer
          bg="white-3 hover:white-4"
          @click.stop="() => {
            if (typeof value === 'string')
              value = undefined
            else if (Array.isArray(value))
              value.splice(index, 1)
          }"
        >
          <div size-5 text-grey-1 i-mingcute:close-line />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.img-preview {
  .button {
    border-radius: 6px;
  }

  .close {
    font-size: 16px !important;
  }

  .arrow {
    font-size: 20px !important;
  }

  .options {
    gap: 4px;
    bottom: 80px !important;

    .option {
      width: 36px !important;
      height: 36px !important;
      font-size: 20px;
    }
  }

  .imgs {
    display: flex;
    justify-content: center;
    align-items: center;

    .img.button {
      &.selected {
        background-color: #0068B899 !important;
      }
    }
  }
}
</style>
