<template>
  <div class="space-y-6">
    <div class="text-center space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">
        Inscription
      </h1>
      <p class="text-sm text-muted">
        Crée ton compte
      </p>
    </div>

    <UForm
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="Nom"
        name="name"
      >
        <UInput
          v-model="state.name"
          placeholder="Ton nom"
          class="w-full"
          autocomplete="name"
        />
      </UFormField>

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
          autocomplete="new-password"
        />
      </UFormField>

      <UFormField
        label="Confirmer le mot de passe"
        name="passwordConfirmation"
      >
        <UInput
          v-model="state.passwordConfirmation"
          type="password"
          placeholder="••••••••"
          class="w-full"
          autocomplete="new-password"
        />
      </UFormField>

      <UButton
        type="submit"
        block
        :loading="loading"
      >
        Créer mon compte
      </UButton>
    </UForm>

    <p class="text-center text-sm text-muted">
      Déjà un compte ?
      <NuxtLink
        to="/auth/login"
        class="underline underline-offset-4"
      >
        Se connecter
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
const { register } = useAuth()
const loading = ref(false)

const schema = z
  .object({
    name: z.string().min(2, 'Minimum 2 caractères'),
    email: z.email('Email invalide'),
    password: z.string().min(6, 'Minimum 6 caractères'),
    passwordConfirmation: z.string().min(6, 'Minimum 6 caractères')
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirmation']
  })

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  name: undefined,
  email: undefined,
  password: undefined,
  passwordConfirmation: undefined
})

const onSubmit = async () => {
  loading.value = true
  const result = await register(
    state.name as string,
    state.email as string,
    state.password as string,
    state.passwordConfirmation as string
  )

  if (result.success) {
    await navigateTo('/dashboard')
  } else {
    toast.add({
      title: 'Erreur d\'inscription',
      description: result.data?.message || 'Impossible de créer le compte',
      color: 'error'
    })
  }

  loading.value = false
}
</script>
