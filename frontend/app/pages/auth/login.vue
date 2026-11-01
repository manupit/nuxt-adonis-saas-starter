<template>
  <div class="space-y-6">
    <div class="text-center space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">
        Connexion
      </h1>
      <p class="text-sm text-muted">
        Accède à ton compte
      </p>
    </div>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="Email"
        name="email"
      >
        <UInput
          v-model="state.email"
          type="email"
          placeholder="email@example.com"
          class="w-full"
          autocomplete="email"
        />
      </UFormField>

      <UFormField
        label="Mot de passe"
        name="password"
      >
        <UInput
          v-model="state.password"
          type="password"
          placeholder="••••••••"
          class="w-full"
          autocomplete="current-password"
        />
      </UFormField>

      <div class="flex justify-end">
        <NuxtLink
          to="/auth/forgot-password"
          class="text-sm text-muted underline underline-offset-4"
        >
          Mot de passe oublié ?
        </NuxtLink>
      </div>

      <UButton
        type="submit"
        block
        :loading="loading"
      >
        Se connecter
      </UButton>
    </UForm>

    <p class="text-center text-sm text-muted">
      Pas encore de compte ?
      <NuxtLink
        to="/auth/register"
        class="underline underline-offset-4"
      >
        Créer un compte
      </NuxtLink>
    </p>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'

definePageMeta({
  layout: 'auth',
  auth: false,
  guest: true
})

const toast = useToast()
const { login } = useAuth()
const loading = ref(false)

const schema = z.object({
  email: z.email('Email invalide'),
  password: z.string().min(6, 'Minimum 6 caractères')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined,
  password: undefined
})

const onSubmit = async () => {
  loading.value = true
  const result = await login(state.email as string, state.password as string)

  if (result.success) {
    await navigateTo('/dashboard')
  } else {
    toast.add({
      title: 'Erreur de connexion',
      description: result.data?.message || 'Identifiants invalides',
      color: 'error'
    })
  }

  loading.value = false
}
</script>
