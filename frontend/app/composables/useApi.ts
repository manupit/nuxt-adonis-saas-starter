import type { NitroFetchOptions, NitroFetchRequest } from 'nitropack'

type ApiFetchOptions = Omit<
  NitroFetchOptions<NitroFetchRequest>,
  'baseURL' | 'credentials'
> & {
  key?: string
}

const PUBLIC_AUTH_PATHS = [
  '/auth/me',
  '/auth/login',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/reset-password'
]

export const useApi = () => {
  const requestFetch = useRequestFetch()
  const authUser = useState('authUser')

  const clearSession = () => {
    authUser.value = null
  }

  const handleUnauthorized = async (url: string) => {
    if (PUBLIC_AUTH_PATHS.some(path => url.includes(path))) return

    clearSession()

    if (import.meta.client) {
      const route = useRoute()
      if (route.meta.auth !== false) {
        await navigateTo('/auth/login')
      }
    }
  }

  const call = async <T>(url: string, options: ApiFetchOptions = {}) => {
    try {
      return await requestFetch<T>(url, {
        baseURL: '/api',
        credentials: 'include',
        ...options
      })
    } catch (error: unknown) {
      const status
        = (error as { statusCode?: number, status?: number, response?: { status?: number } })
          ?.statusCode
          ?? (error as { status?: number })?.status
          ?? (error as { response?: { status?: number } })?.response?.status

      if (status === 401) {
        await handleUnauthorized(url)
      }
      throw error
    }
  }

  return { call, clearSession }
}
