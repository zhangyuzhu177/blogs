import {
  defineConfig,
  presetAttributify,
  presetIcons,
  presetTypography,
  presetUno,
  presetWebFonts,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  shortcuts: [
    ['full', 'w-full h-full'],
    ['flex-center', 'flex items-center justify-center'],
    ['w-limited-1', 'w-full max-w-321 px-8 mx-auto'],
    ['absolute-x-center', 'absolute left-1/2 translate-x--1/2'],
    ['absolute-y-center', 'absolute top-1/2 translate-y--1/2'],
    ['absolute-center', 'absolute-x-center absolute-y-center'],
    ['text-xs', 'text-12px leading-18px'],
    ['text-sm', 'text-14px leading-20px'],
    ['text-md', 'text-16px leading-24px'],
    ['text-lg', 'text-18px leading-26px'],
    ['text-xl', 'text-20px leading-30px'],
    ['text-2xl', 'text-24px leading-36px'],
    ['text-3xl', 'text-28px leading-42px'],
    ['text-4xl', 'text-32px leading-48px'],
    ['text-5xl', 'text-40px leading-54px'],
    ['text-6xl', 'text-48px leading-60px'],
    ['subtitle-1', 'text-lg font-600'],
    ['subtitle-2', 'text-md font-600'],
    ['subtitle-3', 'text-sm font-500'],
    ['subtitle-4', 'text-xs font-500'],
    ['size-5', 'w-5 h-5'],
    ['icon', 'size-5 text-grey-6'],
    ['icon:hover', 'icon hover:text-primary-1'],
  ],
  rules: [
    [/^flex-([.\d]+)$/, ([_, num]) => ({ flex: `${num} ${num} 0%` })],
  ],
  presets: [
    presetUno({ dark: 'class' }),
    presetAttributify(),
    presetIcons({
      scale: 1.2,
    }),
    presetTypography(),
    presetWebFonts({}),
  ],
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  safelist: 'prose m-auto text-left'.split(' '),
  theme: {
    colors: {
      primary: { 1: '#004C9A', 2: '#257EDA', 3: '#004C9A', 4: '#E3EFFD' },
      secondary: { 1: '#F99E34' },
      grey: { 1: '#FFFFFF', 2: '#F7F9FC', 3: '#E4E7EC', 4: '#D0D5DD', 5: '#98A2B3', 6: '#667185', 7: '#475367', 8: '#344054', 9: '#1D2739' },
      alerts: { success: '#22B07D', error: '#F44336', warning: '#FFBA2F' },
      white: { 1: '#FFFFFF1A', 2: '#FFFFFF33', 3: '#FFFFFF4d', 4: '#FFFFFF66', 5: '#FFFFFF80', 6: '#FFFFFF99', 7: '#FFFFFFB3', 8: '#FFFFFFCC', 9: '#FFFFFFE6' },
      dark: {
        primary: { 1: '#004C9A', 2: '#1D2739', 3: '#0068B8', 4: '#E3EFFD' }, // 暗黑模式下的 primary 颜色
        grey: { 1: '#1D2739', 2: '#344054', 3: '#475367', 4: '#667185', 5: '#98A2B3', 6: '#D0D5DD', 7: '#E4E7EC', 8: '#F7F9FC', 9: '#FFFFFF' }, // 暗黑模式下的 grey 颜色
      },
    },
    breakpoints: {
      xs: '320px',
      sm: '600px',
      md: '960px',
      lg: '1240px',
      xl: '1920px',
    },
  },
})
