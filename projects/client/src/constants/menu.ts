export interface Menu {
  to: string
  label: string
}

export const MENU: Menu[] = [
  {
    to: '/',
    label: '首页',
  },
  {
    to: '/archives',
    label: '归档',
  },
  // {
  //   to: '/tags',
  //   label: '标签',
  // },
  {
    to: '/gallery',
    label: '图库',
  },
  {
    to: '/about',
    label: '关于',
  },
]
