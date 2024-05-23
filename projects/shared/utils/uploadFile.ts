import { Notify } from 'quasar'
import type { QRejectedEntry } from 'quasar'

export type hint = Partial<Record<'accept' | 'filter' | 'size' | 'duplicate', string>>

/**
 * 选择文件，未通过验证的回调
 */
export function onRejected(e: QRejectedEntry[], hint?: hint) {
  if (e.length) {
    const { failedPropValidation } = e[0]
    if (failedPropValidation === 'accept') {
      Notify.create({
        type: 'danger',
        message: hint?.accept || '不支持的文件类型',
      })
    }
    else if (failedPropValidation === 'filter') {
      Notify.create({
        type: 'danger',
        message: hint?.filter || '不允许的文件',
      })
    }
    else if (
      failedPropValidation === 'max-file-size'
      || failedPropValidation === 'max-total-size'
    ) {
      Notify.create({
        type: 'danger',
        message: hint?.size || '超出限定的文件大小',
      })
    }
    else if (failedPropValidation === 'duplicate') {
      Notify.create({
        type: 'danger',
        message: hint?.duplicate || '重复上传的文件',
      })
    }
  }
}
