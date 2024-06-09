import createTodoListPlugin from '@kangc/v-md-editor/lib/plugins/todo-list/index'
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js'
import VMdPreview from '@kangc/v-md-editor/lib/preview'
import VMdEditor from '@kangc/v-md-editor'
import Prism from 'prismjs'
import type { UserModule } from '~/types'
import '@kangc/v-md-editor/lib/theme/style/vuepress.css'
import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/plugins/todo-list/todo-list.css'

export const install: UserModule = ({ app, isClient }) => {
  if (!isClient)
    return
  VMdPreview.use(vuepressTheme, {
    Prism,
  })
    .use(createTodoListPlugin())
  app.use(VMdPreview)
  VMdEditor.use(vuepressTheme, {})
  app.use(VMdEditor)
}
