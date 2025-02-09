import type { FileBodyDto } from 'types'
import { useRequest } from '../composables/request'

const { $post } = useRequest()

export function uploadFileApi(file: FormData, path: string) {
  return $post<FileBodyDto>(`/file/upload?path=${path}`, file)
}
