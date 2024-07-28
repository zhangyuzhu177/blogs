const query = useLocalStorage('QUERY', '')
export function useMyLocalStorage() {
  return {
    query,
  }
}
