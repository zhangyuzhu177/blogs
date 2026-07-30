import type {
  AgentSourceType,
  IAgentConversation,
  IAgentMessage,
} from 'types'
import { useRequest } from '../composables/request'

const { $get, $patch, $post } = useRequest()

interface AgentConversationQuery {
  visitorId: string
  sourceType?: AgentSourceType
  sourceId?: string
}

/**
 * 获取当前访客的 Agent 会话列表。
 */
export function getAgentConversationsApi(query: AgentConversationQuery) {
  return $get<IAgentConversation[]>('/agent/conversations', query)
}

/**
 * 获取指定 Agent 会话下的消息。
 */
export function getAgentMessagesApi(conversationId: string, visitorId: string) {
  return $get<IAgentMessage[]>(`/agent/conversations/${conversationId}/messages`, {
    visitorId,
  })
}

/**
 * 归档指定 Agent 会话。
 */
export function archiveAgentConversationApi(conversationId: string, visitorId: string) {
  return $patch<void>(`/agent/conversations/${conversationId}/archive`, undefined, {
    params: {
      visitorId,
    },
  })
}

/**
 * 重建单篇文章的 Agent 知识库索引。
 */
export function indexAgentArticleKnowledgeApi(articleId: string) {
  return $post<{ articleId: string; chunkCount: number }>(`/agent/index/article/${articleId}`)
}

/**
 * 重建全部已发布文章的 Agent 知识库索引。
 */
export function indexAllAgentArticleKnowledgeApi() {
  return $post<{ articleCount: number; chunkCount: number }>('/agent/index/articles')
}
