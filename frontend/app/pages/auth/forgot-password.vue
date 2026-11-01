<template>
  <div class="space-y-6">
    <div class="text-center space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">
        Mot de passe oublié
      </h1>
      <p class="text-sm text-muted">
        Entre ton email pour recevoir un lien de réinitialisation
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

      <UButton
        type="submit"
        block
        :loading="loading"
      >
        Envoyer le lien
      </UButton>
    </UForm>

    <p class="text-center text-sm text-muted">
      <NuxtLink
        to="/auth/login"
        class="underline underline-offset-4"
      >
        Retour à la connexion
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
const { forgotPassword } = useAuth()
const loading = ref(false)

const schema = z.object({
  email: z.email('Email invalide')
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  email: undefined
})

const onSubmit = async () => {
  loading.value = true
  const result = await forgotPassword(state.email as string)

  toast.add({
    title: result.success ? 'Email envoyé' : 'Erreur',
    description: result.data?.message
      || (result.success
        ? 'Si un compte existe, un lien a été envoyé.'
        : 'Impossible d\'envoyer le lien'),
    color: result.success ? 'success' : 'error'
  })

  loading.value = false
}
</script>
