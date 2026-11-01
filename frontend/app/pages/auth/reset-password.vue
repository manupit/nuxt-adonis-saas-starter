<template>
  <div class="space-y-6">
    <div class="text-center space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">
        Nouveau mot de passe
      </h1>
      <p class="text-sm text-muted">
        Choisis un nouveau mot de passe
      </p>
    </div>

    <UForm
      v-if="token"
      :schema="schema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
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
        Réinitialiser
      </UButton>
    </UForm>

    <p
      v-else
      class="text-center text-sm text-muted"
    >
      Lien invalide. Demande un nouveau lien depuis la page
      <NuxtLink
        to="/auth/forgot-password"
        class="underline underline-offset-4"
      >
        mot de passe oublié
      </NuxtLink>.
    </p>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'

definePageMeta({
  layout: 'auth',
  auth: false
})

const route = useRoute()
const toast = useToast()
const { resetPassword } = useAuth()
const loading = ref(false)

const token = computed(() => {
  const value = route.query.token
  return typeof value === 'string' && value.length > 0 ? value : null
})

const schema = z
  .object({
    password: z.string().min(6, 'Minimum 6 caractères'),
    passwordConfirmation: z.string().min(6, 'Minimum 6 caractères')
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirmation']
  })

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  password: undefined,
  passwordConfirmation: undefined
})

const onSubmit = async () => {
  if (!token.value) return

  loading.value = true
  const result = await resetPassword(
    token.value,
    state.password as string,
    state.passwordConfirmation as string
  )

  if (result.success) {
    toast.add({
      title: 'Mot de passe mis à jour',
      description: 'Tu peux maintenant te connecter',
      color: 'success'
    })
    await navigateTo('/auth/login')
  } else {
    toast.add({
      title: 'Erreur',
      description: result.data?.message || 'Lien invalide ou expiré',
      color: 'error'
    })
  }

  loading.value = false
}
</script>
