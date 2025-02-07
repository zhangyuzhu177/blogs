import process from 'node:process'
import { defineConfig } from 'vitepress'
import utilStructure from './utils.json'

const base = process.env.NODE_ENV === 'production' ? '/utils/docs/' : '/'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base,
  lastUpdated: true,
  title: '工具函数合集',
  description: '开发用的工具函数合集',
  srcDir: 'src',
  head: [['link', { rel: 'icon', href: `${base}logo.svg` }]],
  themeConfig: {
    logo: '/logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [{ text: 'Home', link: '/' }],
    search: {
      provider: 'local',
    },

    sidebar: [
      ...utilStructure,

      {
        text: '新增与维护',
        link: '/contribute',
      },
      {
        text: '待办事项',
        link: '/roadmap',
      },
    ],

    socialLinks: [
      {
        icon: 'github',
        link: 'https://codeup.aliyun.com/62cea2b83e81781f3ad23a2f/qiyandata/qiyandata-internal.git',
      },
    ],
  },
})
