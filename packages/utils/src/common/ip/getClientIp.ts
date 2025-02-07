import { isIpAddress, isObject } from '../is'

/**
 * 根据请求获取客户端 ip
 * @param req 请求对象
 * @returns 客户端 ip（如果不存在，则返回 null）
 */
export function getClientIp(req: any): string | null {
  if (isObject(req)) {
    const { headers, connection, socket, info, requestContext, raw } = req

    if (headers) {
      if (isIpAddress(headers['x-client-ip']))
        return headers['x-client-ip']

      const xForwardedFor = getClientIpFromXForwardedFor(headers['x-forwarded-for'])
      if (isIpAddress(xForwardedFor))
        return xForwardedFor

      if (isIpAddress(headers['cf-connecting-ip']))
        return headers['cf-connecting-ip']

      if (isIpAddress(headers['fastly-client-ip']))
        return headers['fastly-client-ip']

      if (isIpAddress(headers['true-client-ip']))
        return headers['true-client-ip']

      if (isIpAddress(headers['x-real-ip']))
        return headers['x-real-ip']

      if (isIpAddress(headers['x-cluster-client-ip']))
        return headers['x-cluster-client-ip']

      if (isIpAddress(headers['x-forwarded']))
        return headers['x-forwarded']

      if (isIpAddress(headers['forwarded-for']))
        return headers['forwarded-for']

      if (isIpAddress(headers.forwarded))
        return headers.forwarded

      if (isIpAddress(headers['x-appengine-user-ip']))
        return headers['x-appengine-user-ip']
    }

    if (connection) {
      if (isIpAddress(connection.remoteAddress))
        return connection.remoteAddress

      if (connection.socket && isIpAddress(connection.socket.remoteAddress))
        return connection.socket.remoteAddress
    }

    if (socket && isIpAddress(socket.remoteAddress))
      return socket.remoteAddress

    if (info && isIpAddress(info.remoteAddress))
      return info.remoteAddress

    if (requestContext && requestContext.identity && isIpAddress(requestContext.identity.sourceIp))
      return requestContext.identity.sourceIp

    if (headers) {
      if (isIpAddress(headers['Cf-Pseudo-IPv4']))
        return headers['Cf-Pseudo-IPv4']
    }

    if (raw)
      return getClientIp(raw)
  }
  return null
}

/**
 * 根据 X-Forwarded-For 获取客户端ip
 */
function getClientIpFromXForwardedFor(value: any) {
  if (typeof value === 'string') {
    const forwardedIps = value.split(',').map((v) => {
      const ip = v.trim()

      if (ip.includes(':')) {
        const splitted = ip.split(':')

        if (splitted.length === 2)
          return splitted[0]
      }

      return ip
    })

    for (let i = 0; i < forwardedIps.length; i++) {
      if (isIpAddress(forwardedIps[i]))
        return forwardedIps[i]
    }
  }
  return null
}
