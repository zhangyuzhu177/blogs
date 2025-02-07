import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

import './styles/vars.css'

const theme: Theme = Object.assign({}, DefaultTheme, {
  enhanceApp() {},
})

export default theme
