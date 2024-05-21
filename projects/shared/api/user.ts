import { IUser } from "../types/entities/user.interface";
import { IGetProfileOwnQueryDto } from "../types/http/user/get-profile-own.interface";
import { useRequest } from "../utils/request";

const {$get } = useRequest()

/**获取当前登录用户信息 */
export function getOwnProfileApi(body:IGetProfileOwnQueryDto) {
  return $get<IUser>('/user/profile/own',body)
}
