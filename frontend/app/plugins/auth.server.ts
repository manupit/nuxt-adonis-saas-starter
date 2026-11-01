import { useAuth } from '~/composables/useAuth'

export default defineNuxtPlugin(async () => {
  const { hydrateSession } = useAuth()
  await hydrateSession()
})
