import { isClient } from "@vueuse/core"

/** 是否展开侧边栏 */
const isExpand = ref(true)
/**是否显示线条元素 */
const isShow = ref(true)

/**过渡时间 */
const time = 300
/**基本宽度 */
const baseWidth = 800
/**定时器 */
let timeout: number | undefined

export function useSidebar() {

  /** 切换侧边栏的展开状态 */
  function changeState(flag?:boolean) {
    if (!isClient)
      return
    clearTimeout(timeout)

    isExpand.value = flag === undefined ? !isExpand.value : flag
    if (isExpand.value) {
      isShow.value = true
    }
    else {
      timeout = window.setTimeout(() => {
        isShow.value = false
      }, time)
    }
  }

  return {
    isExpand,
    isShow,
    time,
    baseWidth,
    changeState,
  }
}
