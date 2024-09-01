const articleId = useSessionStorage('ARTICLE_ID', '')
export function useMyLocalStorage() {
  return {
    articleId,
  }
}
