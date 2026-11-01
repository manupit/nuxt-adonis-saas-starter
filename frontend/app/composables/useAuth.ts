import { useApi } from '~/composables/useApi'

export type AuthUser = {
  id: number
  email: string
  fullName: string | null
}

type AuthResponse = {
  success: boolean
  message?: string
  user?: AuthUser
}

export const useAuth = () => {
  const { call, clearSession } = useApi()
  const authUser = useState<AuthUser | null>('authUser', () => null)

  const hydrateSession = async () => {
    try {
      const data = await call<AuthResponse>('/auth/me')
      if (!data?.success || !data.user) {
        clearSession()
        return null
      }
      authUser.value = data.user
      return data.user
    } catch {
      clearSession()
      return null
    }
  }

  const validateSession = async () => {
    if (!authUser.value) return null
    return hydrateSession()
  }

  const login = async (email: string, password: string) => {
    try {
      const data = await call<AuthResponse>('/auth/login', {
        method: 'POST',
        body: { email, password }
      })

      if (data?.success) {
        await hydrateSession()
        return { success: true, data }
      }

      return { success: false, data }
    } catch (err: unknown) {
      return { success: false, data: (err as { data?: AuthResponse }).data }
    }
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string
  ) => {
    try {
      const data = await call<AuthResponse>('/auth/register', {
        method: 'POST',
        body: { name, email, password, passwordConfirmation }
      })

      if (data?.success) {
        await hydrateSession()
        return { success: true, data }
      }

      return { success: false, data }
    } catch (err: unknown) {
      return { success: false, data: (err as { data?: AuthResponse }).data }
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      const data = await call<AuthResponse>('/auth/forgot-password', {
        method: 'POST',
        body: { email }
      })
      return { success: !!data?.success, data }
    } catch (err: unknown) {
      return { success: false, data: (err as { data?: AuthResponse }).data }
    }
  }

  const resetPassword = async (
    token: string,
    password: string,
    passwordConfirmation: string
  ) => {
    try {
      const data = await call<AuthResponse>('/auth/reset-password', {
        method: 'POST',
        body: { token, password, passwordConfirmation }
      })
      return { success: !!data?.success, data }
    } catch (err: unknown) {
      return { success: false, data: (err as { data?: AuthResponse }).data }
    }
  }

  const updateProfile = async (name: string) => {
    try {
      const data = await call<AuthResponse>('/account', {
        method: 'PATCH',
        body: { name }
      })

      if (data?.success && data.user) {
        authUser.value = data.user
        return { success: true, data }
      }

      return { success: false, data }
    } catch (err: unknown) {
      return { success: false, data: (err as { data?: AuthResponse }).data }
    }
  }

  const changePassword = async (
    currentPassword: string,
    password: string,
    passwordConfirmation: string
  ) => {
    try {
      const data = await call<AuthResponse>('/account/password', {
        method: 'PUT',
        body: { currentPassword, password, passwordConfirmation }
      })
      return { success: !!data?.success, data }
    } catch (err: unknown) {
      return { success: false, data: (err as { data?: AuthResponse }).data }
    }
  }

  const deleteAccount = async (password: string) => {
    try {
      const data = await call<AuthResponse>('/account', {
        method: 'DELETE',
        body: { password }
      })

      if (data?.success) {
        clearSession()
        await navigateTo('/auth/login')
        return { success: true, data }
      }

      return { success: false, data }
    } catch (err: unknown) {
      return { success: false, data: (err as { data?: AuthResponse }).data }
    }
  }

  const logout = async () => {
    try {
      await call('/auth/logout', { method: 'POST' })
    } finally {
      clearSession()
      await navigateTo('/auth/login')
    }
  }

  return {
    authUser,
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    deleteAccount,
    hydrateSession,
    validateSession
  }
}
