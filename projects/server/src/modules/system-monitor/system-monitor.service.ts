import { ConfigService } from '@nestjs/config'
import { Client } from 'ssh2'
import type { ConnectConfig } from 'ssh2'
import { Injectable, Logger } from '@nestjs/common'
import type { SystemConfig } from 'src/config/_system.config'
import { responseError } from 'src/utils'
import { ErrorCode } from 'types'

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
        this._logger.log('远程服务器连接成功')
        resolve()
      })

      this._conn.on('error', (err: Error) => {
        this._logger.error('远程服务器连接失败')
        reject(err)
      })

      this._conn.on('end', () => {
        this._logger.log('SSH连接已关闭')
      })

      this._conn.connect(this._connConfig)
    })
  }

  async getSystemInfo() {
    try {
      await this.connect()

      // 1. 获取操作系统和架构信息
      const osInfo = await this.executeCommand('uname -smo')
      const [osName, , architecture] = osInfo.trim().split(' ')

      // 2. 获取CPU信息
      const cpuInfo = {
        model: await this.executeCommand('cat /proc/cpuinfo | grep "model name" | head -n 1 | cut -d ":" -f 2 | sed \'s/^[ \\t]*//\''),
        cores: Number.parseInt(await this.executeCommand('nproc')),
        load: await this.getCpuLoad(),
      }

      // 3. 获取内存信息
      const memoryInfo = await this.parseMemoryInfo()

      // 4. 获取磁盘信息
      const diskInfo = await this.parseDiskInfo()

      return {
        system: {
          os: osName,
          architecture,
          hostname: await this.executeCommand('hostname'),
        },
        cpu: cpuInfo,
        memory: memoryInfo,
        disks: diskInfo,
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
  private async getCpuLoad(): Promise<{ avg1: number; avg5: number; avg15: number }> {
    const load = (await this.executeCommand('cat /proc/loadavg')).trim().split(/\s+/)
    return {
      avg1: Number.parseFloat(load[0]),
      avg5: Number.parseFloat(load[1]),
      avg15: Number.parseFloat(load[2]),
    }
  }

  /**
   * 解析内存信息
   */
  private async parseMemoryInfo(): Promise<{
    total: number
    used: number
    free: number
    cached: number
    swapTotal: number
    swapUsed: number
  }> {
    const memInfo = await this.executeCommand('cat /proc/meminfo')
    const values: Record<string, number> = {}

    memInfo.split('\n').forEach((line) => {
      const match = line.match(/^([^:]+):\s+(\d+)\s*kB/)
      if (match)
        values[match[1]] = Number.parseInt(match[2]) * 1024 // 转换为bytes
    })

    return {
      total: values.MemTotal,
      used: values.MemTotal - values.MemFree - values.Buffers - values.Cached,
      free: values.MemFree,
      cached: values.Cached,
      swapTotal: values.SwapTotal,
      swapUsed: values.SwapTotal - values.SwapFree,
    }
  }

  /**
   * 解析磁盘信息
   */
  private async parseDiskInfo(): Promise<{
    total: number
    used: number
    available: number
    usagePercent: string
  } > {
  // 使用 df 命令获取所有物理磁盘的汇总信息（排除tmpfs等特殊文件系统）
    const dfOutput = await this.executeCommand(`
    df -k --total -x tmpfs -x devtmpfs -x squashfs | grep 'total'
  `)

    // 示例输出：
    // total      102400000  61440000  40960000   60%
    const parts = dfOutput.trim().split(/\s+/)

    return {
      total: Number.parseInt(parts[1]) * 1024, // 转换为bytes
      used: Number.parseInt(parts[2]) * 1024,
      available: Number.parseInt(parts[3]) * 1024,
      usagePercent: parts[4],
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
