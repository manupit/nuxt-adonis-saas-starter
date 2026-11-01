import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async () => {
  const authUser = useState('authUser')
  const { validateSession } = useAuth()

  const syncSession = async () => {
    if (!authUser.value) return

    const user = await validateSession()
    if (!user) {
      const route = useRoute()
      if (route.meta.auth !== false) {
        await navigateTo('/auth/login')
      }
    }
  }

  await syncSession()

  const onVisibilityChange = () => {
    if (document.visibilityState === 'visible') {
      syncSession()
    }
  }

  document.addEventListener('visibilitychange', onVisibilityChange)
})
