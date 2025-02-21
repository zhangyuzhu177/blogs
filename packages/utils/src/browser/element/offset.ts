/**
 * 获取指定元素相对指定祖先元素的偏移量
 * @param el 目标元素
 * @param parent 目标祖先元素
 * @returns 偏移量
 */
export function getOffsetRelativeToParent(el?: HTMLElement, parent?: HTMLElement) {
  let left = el?.offsetLeft ?? 0
  let top = el?.offsetTop ?? 0

  // 如果子元素的父元素不是目标祖先元素，则递归计算
  while (el?.offsetParent && el.offsetParent !== parent) {
    el = el.offsetParent as HTMLElement
    left += el.offsetLeft
    top += el.offsetTop
  }

  return { left, top }
}
