const { width } = useWindowSize()

/** 过渡动画时间(单位：ms) */
const ANIMATION_TIME = 300
/** 基本宽度 */
const BASE_WIDTH = 960

/** 是否展开侧边栏 */
const isExpand = ref(width.value >= BASE_WIDTH)
export function useSidebar() {
  /**
   * 切换侧边栏的展开状态
   */
  function changeState(flag?: boolean) {
    isExpand.value = flag === undefined ? !isExpand.value : flag
  }

  return {
    isExpand,

    ANIMATION_TIME,
    BASE_WIDTH,

    changeState,
  }
}
