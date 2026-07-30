import type { AgentStreamEvent, IAgentChatStreamBodyDto } from 'types'

type AgentStreamHandler = (event: AgentStreamEvent) => void

function parseSseEvent(rawEvent: string, onEvent: AgentStreamHandler) {
  const payload = rawEvent
    .split('\n')
    .filter(item => item.startsWith('data:'))
    .map(item => item.replace(/^data:\s?/, ''))
    .join('\n')
    .trim()

  if (!payload)
    return

  onEvent(JSON.parse(payload))
}

/**
 * Agent 流式请求封装。
 * 浏览器端使用原生 fetch 读取 ReadableStream，比 Axios 更适合处理 SSE 增量数据。
 */
export function useAgentStream() {
  let controller: AbortController | undefined

  /**
   * 取消当前回答。
   * 用户关闭弹窗或连续提问时调用，避免后端仍持续生成。
   */
  function abort() {
    controller?.abort()
    controller = undefined
  }

  /**
   * 发起 Agent 流式问答。
   * 注意：SSE 的 JSON 可能被网络分包拆开，所以这里维护 buffer 来拼接完整事件。
   */
  async function stream(body: IAgentChatStreamBodyDto, onEvent: AgentStreamHandler) {
    abort()
    controller = new AbortController()

    const base = import.meta.env.VITE_API_BASE || '/api'
    const response = await fetch(`${base}/agent/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    if (!response.ok)
      throw new Error(`Agent stream failed: ${response.status}`)

    const reader = response.body?.getReader()
    if (!reader)
      throw new Error('当前浏览器不支持流式响应')

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done)
        break

      buffer += decoder.decode(value, { stream: true })
      const events = buffer.split('\n\n')
      buffer = events.pop() || ''

      for (const rawEvent of events)
        parseSseEvent(rawEvent, onEvent)
    }

    buffer += decoder.decode()
    if (buffer.trim())
      parseSseEvent(buffer, onEvent)
  }

  return {
    abort,
    stream,
  }
}
