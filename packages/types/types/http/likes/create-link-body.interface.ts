import type { ILikes } from '../../entities/likes.interface'

export interface ICreateLikeBodyDto
  extends Pick<ILikes, 'visitorId' | 'contentId'> { }
