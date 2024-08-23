export interface Nav {
  id: string
  label: string
  path: string
}

export const NAV: Nav[] = [
  {
    id: 'home',
    label: '博客',
    path: '/home',
  },
  {
    id: 'about',
    label: '关于',
    path: '/about',
  },
]
