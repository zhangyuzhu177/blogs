import path from 'node:path'
import process from 'node:process'
import Unocss from 'unocss/vite'
import Vue from '@vitejs/plugin-vue'
import Pages from 'vite-plugin-pages'
import { defineConfig, loadEnv } from 'vite'
import Layouts from 'vite-plugin-vue-layouts'
import generateSitemap from 'vite-ssg-sitemap'
import VueMacros from 'unplugin-vue-macros/vite'
import AutoImport from 'unplugin-auto-import/vite'
import VueDevTools from 'vite-plugin-vue-devtools'
import WebfontDownload from 'vite-plugin-webfont-dl'
import Components from 'unplugin-vue-components/vite'
import { QuasarResolver } from 'unplugin-vue-components/resolvers'

export default ({ mode }: any) => {
  // 默认环境配置
  const defaultEnv = {
    VITE_CLIENT_PORT: '5000',
    VITE_CLIENT_BASE: '/',
    VITE_API_BASE: '/api',
  }

  // 后端服务读取的配置
  const nodeEnv = {
    ...loadEnv(mode, path.relative(__dirname, '../server'), 'APP'),
    ...loadEnv(mode, path.relative(__dirname, '../server'), 'RSA_PUBLIC'),
  }

  process.env = {
    ...process.env,
    ...defaultEnv,
    ...Object.keys(nodeEnv).reduce((newObj, key) => {
      newObj[`VITE_${key}`] = nodeEnv[key]
      return newObj
    }, {} as Record<string, string>),
    // 环境变量
    ...loadEnv(mode, path.relative(__dirname, '../shared')),
    VITE_MODE: mode,
  }

  return defineConfig({
    base: process.env.VITE_CLIENT_BASE,
    define: {
      'process.env': {},
    },

    server: {
      host: '0.0.0.0',
      port: Number.parseInt(process.env.VITE_CLIENT_PORT!),
      proxy: {
        [process.env.VITE_API_BASE as string]: {
          target: process.env.VITE_PROXY_TARGET,
          changeOrigin: true,
          rewrite: path => path.replace(new RegExp(`^${process.env.VITE_API_BASE}`), ''),
          secure: false,
        },
      },
    },

    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src'),
      },
    },

    plugins: [
      VueMacros({
        plugins: {
          vue: Vue({
            include: [/\.vue$/, /\.md$/],
          }),
        },
      }),

      // https://github.com/hannoeru/vite-plugin-pages
      Pages({
        extensions: ['vue', 'md'],
      }),

      // https://github.com/JohnCampionJr/vite-plugin-vue-layouts
      Layouts(),

      // https://github.com/antfu/unplugin-auto-import
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          '@vueuse/head',
          '@vueuse/core',
          'quasar',
        ],
        dts: 'src/types/auto-imports.d.ts',
        dirs: [
          'src/composables',
          'src/constants',
          'src/utils',
          '../shared/api',
          '../shared/composables',
          '../shared/constants',
          '../shared/utils/**',
        ],
        vueTemplate: true,
        resolvers: [QuasarResolver()],
      }),

      // https://github.com/antfu/unplugin-vue-components
      Components({
        // allow auto load markdown components under `./src/components/`
        extensions: ['vue', 'md'],
        // allow auto import and register components used in markdown
        include: [/\.vue$/, /\.vue\?vue/, /\.md$/],
        dts: 'src/types/components.d.ts',
        dirs: [
          'src/components',
          '../shared/components',
        ],
        resolvers: [QuasarResolver()],
      }),

      // https://github.com/antfu/unocss
      // see uno.config.ts for config
      Unocss(),

      // https://github.com/feat-agency/vite-plugin-webfont-dl
      WebfontDownload(),

      // https://github.com/webfansplz/vite-plugin-vue-devtools
      VueDevTools(),
    ],

    // https://github.com/antfu/vite-ssg
    ssgOptions: {
      script: 'async',
      formatting: 'minify',
      crittersOptions: {
        reduceInlineStyles: false,
      },
      onFinished() {
        const flag = process.env.VITE_SITEMAP ?? false
        const truly = [true, 'true', 'yes', '1', 'TRUE', 'YES', 'True', 'Yes']
        if (truly.includes(flag))
          generateSitemap()
      },
    },

    ssr: {
      // TODO: workaround until they support native ESM
      noExternal: [
        'workbox-window',
        'lodash',
        'jsencrypt',
        'quasar',
        'md-editor-v3',
        '@vavt/v3-extension',
      ],
    },
  })
}
