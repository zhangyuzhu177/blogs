/**
 * 服务器返回信息
 */
export interface SystemMonitorReturnInfo {
  /**
   * 系统信息
   */
  system: ISystemInfo
  /**
   * CPU信息
   */
  cpu: ICpuInfo
  /**
   * 内存信息
   */
  memory: IMemoryInfo
  /**
   * 磁盘信息
   */
  disks: IDiskInfo
}

/**
 * 系统信息
 */
export interface ISystemInfo {
  /**
   * 操作系统名称
   */
  os: string
  /**
   * 系统架构
   */
  architecture: string
  /**
   * 主机名
   */
  hostname: string
}

/**
 * CPU信息
 */
export interface ICpuInfo {
  /**
   * CPU型号
   */
  model: string
  /**
   * CPU核心数
   */
  cores: number
  /**
   * CPU负载
   */
  load: {
    avg1: number
    avg5: number
    avg15: number
  }
}

/**
 * 内存信息
 */
export interface IMemoryInfo {
  /**
   * 物理内存总容量
   */
  total: number
  /**
   * 已使用的内存（含缓存）
   */
  used: number
  /**
   * 实际可用内存（含可回收缓存）
   */
  available: number
  /**
   * 内存使用率
   */
  usagePercent: string
}

/**
 * 磁盘信息
 */
export interface IDiskInfo {
  /**
   * 磁盘总容量
   */
  total: number
  /**
   * 已使用的磁盘空间
   */
  used: number
  /**
   * 可用磁盘空间
   */
  available: number
  /**
   * 磁盘使用率
   */
  usagePercent: string
}
