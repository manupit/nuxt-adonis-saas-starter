<script setup lang="ts">
const { authUser, logout } = useAuth()
const colorMode = useColorMode()
const route = useRoute()
const loggingOut = ref(false)

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (value: boolean) => {
    colorMode.preference = value ? 'dark' : 'light'
  }
})

const links = [
  { label: 'Dashboard', to: '/dashboard', icon: 'i-lucide-layout-dashboard' },
  { label: 'Compte', to: '/dashboard/account', icon: 'i-lucide-user' }
]

const onLogout = async () => {
  loggingOut.value = true
  await logout()
  loggingOut.value = false
}
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-default">
      <div class="mx-auto flex h-14 max-w-5xl items-center justify-between gap-4 px-4">
        <div class="flex items-center gap-6">
          <NuxtLink
            to="/dashboard"
            class="text-sm font-semibold tracking-tight"
          >
            Starter Kit
          </NuxtLink>

          <nav class="hidden sm:flex items-center gap-1">
            <UButton
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              :icon="link.icon"
              :variant="route.path === link.to ? 'soft' : 'ghost'"
              color="neutral"
              size="sm"
            >
              {{ link.label }}
            </UButton>
          </nav>
        </div>

        <div class="flex items-center gap-2">
          <span class="hidden sm:inline text-sm text-muted truncate max-w-40">
            {{ authUser?.email }}
          </span>

          <ClientOnly>
            <UButton
              :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="Basculer le thème"
              @click="isDark = !isDark"
            />
          </ClientOnly>

          <UButton
            color="neutral"
            variant="outline"
            size="sm"
            :loading="loggingOut"
            @click="onLogout"
          >
            Déconnexion
          </UButton>
        </div>
      </div>
    </header>

    <main class="flex-1">
      <div class="mx-auto max-w-5xl px-4 py-8">
        <slot />
      </div>
    </main>
  </div>
</template>
