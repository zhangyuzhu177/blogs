interface Env extends ImportMetaEnv {
  /** ---------------- 仅开发模式 ---------------- */
  /** 客户端启动端口 */
  VITE_CLIENT_PORT?: number
  /** 客户端基础路径 */
  VITE_CLIENT_BASE?: string
  /** 客户端APP名称 */
  VITE_CLIENT_APP_NAME?: string
  /** 客户端APP图标路径 */
  VITE_CLIENT_APP_ICON?: string

  /** 管理后台启动端口 */
  VITE_ADMIN_PORT?: number
  /** 管理后台基础路径 */
  VITE_ADMIN_BASE?: string
  /** 管理后台APP名称 */
  VITE_ADMIN_APP_NAME?: string
  /** 管理后台APP图标路径 */
  VITE_ADMIN_APP_ICON?: string

  /** python代理 */
  VITE_PROXY_TARGET_PY?: string
  /** python  */
  // VITE_API_BASE?: string
  VITE_API_BASE_PY?: string
  /** nestjs代理 */
  VITE_PROXY_TARGET_NESTJS?: string
  /** API基础路径 */
  VITE_API_BASE_NESTJS?: string


  /** RSA密钥对 */
  VITE_PUBLIC_KEY: string
  VITE_PRIVATE_KEY: string

  /**是否使用手机号 */
  VITE_USER_PHONE: boolean

  /**是否启用站点地图 */
  VITE_SITEMAP: boolean
}

interface ImportMeta {
  env: Env
}

declare module '*?raw' {
  const src: string
  export default src
}
declare module '*.png' {
  const src: string
  export default src
}
declare module '*.jpg' {
  const src: string
  export default src
}
