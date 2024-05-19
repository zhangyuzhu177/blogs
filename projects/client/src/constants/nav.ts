export interface Nav {
  id: string
  label: string
  path: string
}

export const NAV: Nav[] = [
  {
    id: 'home',
    label: '首页',
    path: '/home',
  },
  {
    id: 'article',
    label: '文章',
    path: '/article',
  },

  {
    id: 'about',
    label: '关于',
    path: '/about',
  },
]
