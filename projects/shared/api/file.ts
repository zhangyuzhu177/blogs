import { FileBodyDto } from "types/http/file/file.body"
import { useRequest } from "../utils/request"

const { $post } = useRequest()

export function uploadFileApi(file: FormData, path: string) {
  return $post<FileBodyDto>(`/file/upload?path=${path}`, file)
}
