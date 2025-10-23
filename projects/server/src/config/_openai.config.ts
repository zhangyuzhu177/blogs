import type OpenAI from 'openai'
import { registerAs } from '@nestjs/config'

export default registerAs('openai', (): Pick<OpenAI, 'baseURL' | 'apiKey'> => {
  const { OPENAI_API_KEY, OPENAI_BASE_URL } = process.env

  return {
    apiKey: OPENAI_API_KEY,
    baseURL: OPENAI_BASE_URL,
  }
})
