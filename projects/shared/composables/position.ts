import { nextTick } from 'vue'
import { isClient } from '@vueuse/core'
import { useSysConfig } from './app'

export function usePosition() {
  const { zoomRatio } = useSysConfig()

  /**
   * 当页面缩放时，校准元素定位
   */
  function calibration(id: string, type: 'absolute' | 'translate' = 'absolute', offset = [0, 0]) {
    if (isClient) {
      nextTick(() => {
        const el = document.querySelector(`#${id}`) as HTMLElement
        if (el) {
          if (type === 'absolute')
            byAbsolute(el, offset)
          else if (type === 'translate')
            byTranslate(el, offset)
        }
      })
    }
  }

  /**
   * 根据元素的绝对定位校准
   */
  function byAbsolute(el: HTMLElement | string, offset = [0, 0]) {
    if (typeof el === 'string')
      return calibration(el, 'absolute', offset)

    setTimeout(() => {
      const top = Number.parseFloat(el.style.top)
      const left = Number.parseFloat(el.style.left)
      const ratio = zoomRatio.value
      el.style.transform = `translate(${left / ratio - left + offset[0]}px, ${top / ratio - top + offset[1]}px)`
    })
  }

  /**
   * 根据元素的位移校准
   */
  function byTranslate(el: HTMLElement | string, offset = [0, 0]) {
    if (typeof el === 'string')
      return calibration(el, 'translate', offset)

    setTimeout(() => {
      const { transform } = el.style
      const regex = /translate(?:3d)?\((-?\d+(?:\.\d+)?px)(?:,\s?(-?\d+(?:\.\d+)?px))/
      const matches = transform.match(regex)
      const ratio = zoomRatio.value

      if (matches) {
        const [, x, y] = matches
        const numbers = [x, y].map(v => Math.abs(Number.parseFloat(v) || 0))
        el.style.right = `${numbers[0] / ratio - numbers[0]}px`
        el.style.top = `${numbers[1] / ratio - numbers[1]}px`
      }
    })
  }

  return {
    calibration,
    byAbsolute,
    byTranslate,
  }
}
