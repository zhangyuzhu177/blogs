import { Client } from 'ssh2'
import { ErrorCode } from 'types'
import type { ConnectConfig } from 'ssh2'
import { ConfigService } from '@nestjs/config'
import { Injectable, Logger } from '@nestjs/common'
import type { ICpuInfo, IDiskInfo, IMemoryInfo, ISystemInfo } from 'types'

import { responseError } from 'src/utils'
import type { SystemConfig } from 'src/config/_system.config'

@Injectable()
export class SystemMonitorService {
  private readonly _logger = new Logger(SystemMonitorService.name)
  // ssh连接配置
  private readonly _connConfig: ConnectConfig
  // ssh连接实例
  private _conn: Client

  constructor(
    private _cfgSrv: ConfigService,
  ) {
    const { server } = _cfgSrv.get('system') as SystemConfig
    this._connConfig = server
  }

  /**
   * 连接远程服务器
   */
  public async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._conn = new Client()

      this._conn.on('ready', () => {
        this._logger.verbose('远程服务器连接成功')
        resolve()
      })

      this._conn.on('error', (err: Error) => {
        this._logger.error('远程服务器连接失败')
        reject(err)
      })

      this._conn.on('end', () => {
        this._logger.verbose('SSH连接已关闭')
      })

      this._conn.connect(this._connConfig)
    })
  }

  /**
   * 获取服务器监控信息
   */
  async getSystemInfo() {
    try {
      await this.connect()

      // 1. 获取操作系统和架构信息
      const os = await this.executeCommand('uname -s')
      const architecture = await this.executeCommand('uname -m')
      const node = await this.executeCommand('node -v')

      const systemInfo: ISystemInfo = {
        os,
        architecture,
        node,
      }

      // 2. 获取CPU信息
      const cpuInfo: ICpuInfo = {
        model: await this.executeCommand('cat /proc/cpuinfo | grep "model name" | head -n 1 | cut -d ":" -f 2 | sed \'s/^[ \\t]*//\''),
        cores: Number.parseInt(await this.executeCommand('nproc')),
        load: await this.getCpuLoad(),
        coresLoad: await this.getCoreLoads(),
      }

      return {
        system: systemInfo,
        cpu: cpuInfo,
        memory: await this.parseMemoryInfo(),
        disks: await this.parseDiskInfo(),
        uptime: await this.executeCommand('uptime -p'),
      }
    }
    catch (e) {
      responseError(ErrorCode.COMMON_CONNECT_SERVER_FAILED)
    }
    finally {
      this.disconnect()
    }
  }

  /**
   * 辅助方法：执行SSH命令
   */
  private async executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      this._conn.exec(command, (err, stream) => {
        if (err)
          return reject(err)

        let data = ''
        stream.on('data', (chunk) => {
          data += chunk.toString()
        })
          .on('close', () => {
            resolve(data)
          })
          .stderr.on('data', (err) => {
            reject(new Error(err.toString()))
          })
      })
    })
  }

  /**
   * 获取CPU负载
   */
  private async getCpuLoad(): Promise<ICpuInfo['load']> {
    const load = (await this.executeCommand('cat /proc/loadavg')).trim().split(/\s+/)
    return {
      avg1: Number.parseFloat(load[0]),
      avg5: Number.parseFloat(load[1]),
      avg15: Number.parseFloat(load[2]),
    }
  }

  /**
   * 获取cpu核心负载
   */
  private async getCoreLoads(): Promise<ICpuInfo['coresLoad']> {
  // 获取 /proc/stat 内容
    const stat = await this.executeCommand('cat /proc/stat')

    const cores: ICpuInfo['coresLoad'] = []

    stat.split('\n').forEach((line) => {
      if (line.startsWith('cpu') && !line.startsWith('cpu ')) {
        const cols = line.trim().split(/\s+/)
        const coreId = Number.parseInt(cols[0].substring(3))

        // 计算总时间片
        const total = cols.slice(1).reduce((sum, v) => sum + Number.parseInt(v), 0)
        const idle = Number.parseInt(cols[4]) // 空闲时间

        cores.push({
          core: coreId,
          usage: total > 0 ? Math.round(100 * (1 - idle / total)) : 0,
        })
      }
    })

    return cores
  }

  /**
   * 解析内存信息
   */
  private async parseMemoryInfo(): Promise<IMemoryInfo> {
    const memInfo = await this.executeCommand('cat /proc/meminfo')
    const values: Record<string, number> = {}
    memInfo.split('\n').forEach((line) => {
      const match = line.match(/^([^:]+):\s+(\d+)\s*kB/)
      if (match)
        values[match[1]] = Number.parseInt(match[2]) * 1024 // 转换为bytes
    })

    const total = values.MemTotal
    const used = total - values.MemFree - values.Buffers - values.Cached
    // 计算内存使用率，保留两位小数
    const usagePercent = total > 0 ? Number.parseFloat((used / total * 100).toFixed(2)) : 0

    // 从 /proc/meminfo 获取更精确的 Available 内存（适用于较新内核）
    const available = await this.executeCommand(`
    grep -i MemAvailable /proc/meminfo | awk '{print $2 * 1024}'
  `).catch(() => {
    // 回退计算方式（旧内核不支持 MemAvailable）
      return values[6] || (values[1] - values[2] - values[5])
    })

    return {
      total: values.MemTotal,
      used: values.MemTotal - values.MemFree - values.Buffers - values.Cached,
      available: Number(available),
      usagePercent,
    }
  }

  /**
   * 解析磁盘信息
   */
  private async parseDiskInfo(): Promise<IDiskInfo> {
  // 1. 获取根分区挂载的真实物理设备（如 /dev/sda1）
    const rootDevice = await this.executeCommand(`
    df / | tail -n 1 | awk '{print $1}'
  `).then(res => res.trim())

    // 2. 获取该物理设备的实际容量（单位：bytes）
    const diskSize = await this.executeCommand(`
    lsblk -b ${rootDevice} -o SIZE -n | head -n 1
  `).then(res => Number(res.trim()))

    // 3. 获取根分区的使用情况（单位：bytes）
    const dfOutput = await this.executeCommand(`
    df -B1 / | tail -n 1
  `)
    const parts = dfOutput.trim().split(/\s+/)

    return {
      total: diskSize, // 物理设备真实总容量
      used: Number(parts[2]), // 已用空间
      available: Number(parts[3]), // 可用空间
      usagePercent: Number(parts[4].replace('%', '')), // 使用率
    }
  }

  /**
   * 断开SSH连接
   */
  public disconnect() {
    if (this._conn) {
      this._conn.end()
      this._conn = null
    }
  }
}
