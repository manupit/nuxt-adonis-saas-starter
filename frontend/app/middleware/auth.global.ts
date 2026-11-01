export default defineNuxtRouteMiddleware((to) => {
  const authUser = useState('authUser')

  const isPublic = to.meta.auth === false
  const isGuestOnly = to.meta.guest === true

  if (!authUser.value && !isPublic) {
    return navigateTo('/auth/login')
  }

  if (authUser.value && isGuestOnly) {
    return navigateTo('/dashboard')
  }
})
