import { ConfigService } from '@nestjs/config'
import { Client } from 'ssh2'
import type { ConnectConfig } from 'ssh2'
import { Injectable, Logger } from '@nestjs/common'
import type { SystemConfig } from 'src/config/_system.config'

@Injectable()
export class SystemMonitorService {
  private readonly _logger = new Logger(SystemMonitorService.name)
  private readonly _connConfig: ConnectConfig

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
  public connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._conn = new Client()

      this._conn.on('ready', () => {
        this._logger.log('远程服务器连接成功')
        resolve()
      })

      this._conn.on('error', (err) => {
        this._logger.error('远程服务器连接失败:', err)
        reject(new Error(`SSH连接失败: ${err.message}`))
      })

      this._conn.on('end', () => {
        this._logger.log('SSH连接已关闭')
      })

      try {
        this._conn.connect(this._connConfig)
      }
      catch (err) {
        this._logger.error('SSH连接初始化失败:', err)
        reject(new Error(`SSH连接初始化失败: ${err.message}`))
      }
    })
  }

  // async getSystemInfo() {
  //   try {
  //     const commands = [
  //       'echo "===== Memory ====="',
  //       'free -m',
  //       'echo ""',
  //       'echo "===== Disk ====="',
  //       'df -h',
  //       'echo ""',
  //       'echo "===== CPU ====="',
  //       'lscpu || cat /proc/cpuinfo',
  //       'echo ""',
  //       'echo "===== Uptime ====="',
  //       'uptime',
  //       'echo ""',
  //       'echo "===== OS Info ====="',
  //       'cat /etc/os-release || lsb_release -a',
  //     ].join('; ')

  //     const rawData = await this.connect()
  //     return this.parseSystemInfo(rawData)
  //   }
  //   finally {
  //     this.sshService.disconnect()
  //   }
  // }

  // private parseSystemInfo(rawData: string) {
  //   const sections = rawData.split('=====').map(s => s.trim()).filter(Boolean)
  //   const result: Record<string, any> = {}

  //   sections.forEach((section) => {
  //     const [title, ...content] = section.split('\n')
  //     const key = title.trim()

  //     switch (key) {
  //       case 'Memory':
  //         result.memory = this.parseMemoryInfo(content.join('\n'))
  //         break
  //       case 'Disk':
  //         result.disk = this.parseDiskInfo(content.join('\n'))
  //         break
  //       case 'CPU':
  //         result.cpu = this.parseCpuInfo(content.join('\n'))
  //         break
  //       case 'Uptime':
  //         result.uptime = content.join('\n').trim()
  //         break
  //       case 'OS Info':
  //         result.os = this.parseOsInfo(content.join('\n'))
  //         break
  //       default:
  //         result[key] = content.join('\n').trim()
  //     }
  //   })

  //   return result
  // }

  // private parseMemoryInfo(data: string) {
  //   const lines = data.split('\n').filter(l => l.trim())
  //   if (lines.length < 2)
  //     return null

  //   const headers = lines[0].split(/\s+/).filter(h => h)
  //   const values = lines[1].split(/\s+/).filter(v => v)

  //   const memory: Record<string, string> = {}
  //   headers.forEach((header, index) => {
  //     if (values[index])
  //       memory[header.toLowerCase()] = values[index]
  //   })

  //   return memory
  // }

  // private parseDiskInfo(data: string) {
  //   const lines = data.split('\n').filter(l => l.trim())
  //   if (lines.length < 2)
  //     return []

  //   const headers = lines[0].split(/\s+/).filter(h => h)
  //   return lines.slice(1).map((line) => {
  //     const values = line.split(/\s+/).filter(v => v)
  //     const disk: Record<string, string> = {}
  //     headers.forEach((header, index) => {
  //       if (values[index])
  //         disk[header.toLowerCase()] = values[index]
  //     })
  //     return disk
  //   })
  // }

  // private parseCpuInfo(data: string) {
  //   const lines = data.split('\n').filter(l => l.trim())
  //   const cpu: Record<string, string> = {}

  //   lines.forEach((line) => {
  //     const [key, ...valueParts] = line.split(':')
  //     if (key && valueParts.length)
  //       cpu[key.trim()] = valueParts.join(':').trim()
  //   })

  //   return cpu
  // }

  // private parseOsInfo(data: string) {
  //   const lines = data.split('\n').filter(l => l.trim())
  //   const os: Record<string, string> = {}

  //   lines.forEach((line) => {
  //     if (line.includes('=')) {
  //       const [key, value] = line.split('=').map(s => s.trim())
  //       os[key] = value.replace(/"/g, '')
  //     }
  //     else {
  //       const [key, ...valueParts] = line.split(':').map(s => s.trim())
  //       if (key && valueParts.length)
  //         os[key] = valueParts.join(':').trim()
  //     }
  //   })

  //   return os
  // }
}
