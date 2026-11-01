<template>
  <div class="min-h-screen flex flex-col">
    <header class="border-b border-default">
      <div class="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
        <p class="text-sm font-semibold tracking-tight">
          Starter Kit
        </p>

        <div class="flex items-center gap-2">
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
            v-if="authUser"
            to="/dashboard"
            size="sm"
          >
            Dashboard
          </UButton>
          <template v-else>
            <UButton
              to="/auth/login"
              color="neutral"
              variant="ghost"
              size="sm"
            >
              Connexion
            </UButton>
            <UButton
              to="/auth/register"
              size="sm"
            >
              Inscription
            </UButton>
          </template>
        </div>
      </div>
    </header>

    <main class="flex-1 flex items-center">
      <div class="mx-auto max-w-2xl px-4 py-16 space-y-6 text-center">
        <h1 class="text-4xl font-semibold tracking-tight text-balance">
          Starter Kit
        </h1>
        <p class="text-muted text-balance">
          Base Nuxt 4 + AdonisJS pour démarrer un SaaS.
          Authentification, sessions et UI prêtes — concentre-toi sur ton produit.
        </p>

        <div class="flex items-center justify-center gap-3">
          <UButton
            :to="authUser ? '/dashboard' : '/auth/register'"
            size="lg"
          >
            {{ authUser ? 'Ouvrir le dashboard' : 'Commencer' }}
          </UButton>
          <UButton
            v-if="!authUser"
            to="/auth/login"
            color="neutral"
            variant="outline"
            size="lg"
          >
            Se connecter
          </UButton>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  auth: false
})

const { authUser } = useAuth()
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (value: boolean) => {
    colorMode.preference = value ? 'dark' : 'light'
  }
})
</script>
