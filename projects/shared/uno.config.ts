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
    ['text-base', 'text-16px leading-24px'],
    ['text-lg', 'text-18px leading-26px'],
    ['text-xl', 'text-20px leading-30px'],
    ['text-2xl', 'text-24px leading-36px'],
  ],
  rules: [
    [/^flex-([\.\d]+)$/, ([_, num]) => ({ flex: `${num} ${num} 0%` })],
  ],
  presets: [
    presetUno(),
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
      primary: { 1: '#0E419C', 2: '#004C9A' },
      secondary: { 1: '#F99E34' },
      grey: { 1: '#FFFFFF', 2: '#F5F7FA', 3: '#D4DDEA', 4: '#A6B1C2', 5: '#6E7686', 6: '#575E6A', 7: '#373C48', 8: '#292D36' },
      gray: { 1: '#FFFFFF', 2: '#F5F7FA', 3: '#D4DDEA', 4: '#A6B1C2', 5: '#6E7686', 6: '#575E6A', 7: '#373C48', 8: '#292D36' },
      alerts: { success: '#22B07D', error: '#F44336', warning: '#FFBA2F' },
      white: { 1: '#FFFFFF1A', 2: '#FFFFFF33', 3: '#FFFFFF4d', 4: '#FFFFFF66', 5: '#FFFFFF80', 6: '#FFFFFF99', 7: '#FFFFFFB3', 8: '#FFFFFFCC', 9: '#FFFFFFE6' },
    },
    breakpoints: {
      xs: '500px',
      sm: '760px',
      lg: '900px',
      xl: '1360px',
      xxl: '1800px',
    },
  },
})
