export interface Classify {
  id: string
  label: string
}
export const CLASSIFY: Classify[] = [
  {
    id: 'back-end',
    label: '后端',
  },
  {
    id: 'front-end',
    label: '前端',
  },
  {
    id: 'ai',
    label: '人工智能',
  },
  {
    id: 'android',
    label: 'Android',
  },
  {
    id: 'ios',
    label: 'IOS',
  },
  {
    id: 'dev',
    label: '开发工具',
  },
  {
    id: 'code',
    label: '代码人生',
  },
  {
    id: 'read',
    label: '阅读',
  },
]

export const ARTICLE_CLASS: Classify[] = [
  {
    id: 'original',
    label: '原创',
  },
  {
    id: 'reprint',
    label: '转载',
  },
  {
    id: 'translate',
    label: '翻译',
  },
]

export const BT: Classify[] = [
  {
    id: 'public',
    label: '公开',
  },
  {
    id: 'draft',
    label: '草稿',
  },
  {
    id: 'private',
    label: '私密',
  },
]
