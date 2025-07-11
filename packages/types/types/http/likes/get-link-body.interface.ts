import type { ILikes } from '../../entities/likes.interface'

export interface IGetLinkBodyDto
  extends Pick<ILikes, 'contentId' | 'type'> { }
