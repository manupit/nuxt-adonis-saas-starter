<template>
  <div class="space-y-10 max-w-lg">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">
        Compte
      </h1>
      <p class="text-sm text-muted">
        Gère ton profil et ta sécurité
      </p>
    </div>

    <section class="space-y-4">
      <h2 class="text-sm font-medium">
        Profil
      </h2>

      <UForm
        :schema="profileSchema"
        :state="profileState"
        class="space-y-4"
        @submit="onUpdateProfile"
      >
        <UFormField
          label="Nom"
          name="name"
        >
          <UInput
            v-model="profileState.name"
            class="w-full"
            autocomplete="name"
          />
        </UFormField>

        <UFormField label="Email">
          <UInput
            :model-value="authUser?.email"
            disabled
            class="w-full"
          />
        </UFormField>

        <UButton
          type="submit"
          :loading="profileLoading"
        >
          Enregistrer
        </UButton>
      </UForm>
    </section>

    <section class="space-y-4">
      <h2 class="text-sm font-medium">
        Mot de passe
      </h2>

      <UForm
        :schema="passwordSchema"
        :state="passwordState"
        class="space-y-4"
        @submit="onChangePassword"
      >
        <UFormField
          label="Mot de passe actuel"
          name="currentPassword"
        >
          <UInput
            v-model="passwordState.currentPassword"
            type="password"
            class="w-full"
            autocomplete="current-password"
          />
        </UFormField>

        <UFormField
          label="Nouveau mot de passe"
          name="password"
        >
          <UInput
            v-model="passwordState.password"
            type="password"
            class="w-full"
            autocomplete="new-password"
          />
        </UFormField>

        <UFormField
          label="Confirmer"
          name="passwordConfirmation"
        >
          <UInput
            v-model="passwordState.passwordConfirmation"
            type="password"
            class="w-full"
            autocomplete="new-password"
          />
        </UFormField>

        <UButton
          type="submit"
          :loading="passwordLoading"
        >
          Changer le mot de passe
        </UButton>
      </UForm>
    </section>

    <section class="space-y-4">
      <h2 class="text-sm font-medium text-error">
        Zone dangereuse
      </h2>
      <p class="text-sm text-muted">
        La suppression de ton compte est définitive.
      </p>

      <UForm
        :schema="deleteSchema"
        :state="deleteState"
        class="space-y-4"
        @submit="onDeleteAccount"
      >
        <UFormField
          label="Confirme avec ton mot de passe"
          name="password"
        >
          <UInput
            v-model="deleteState.password"
            type="password"
            class="w-full"
            autocomplete="current-password"
          />
        </UFormField>

        <UButton
          type="submit"
          color="error"
          variant="soft"
          :loading="deleteLoading"
        >
          Supprimer mon compte
        </UButton>
      </UForm>
    </section>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'

definePageMeta({
  layout: 'dashboard'
})

const toast = useToast()
const {
  authUser,
  updateProfile,
  changePassword,
  deleteAccount
} = useAuth()

const profileLoading = ref(false)
const passwordLoading = ref(false)
const deleteLoading = ref(false)

const profileSchema = z.object({
  name: z.string().min(2, 'Minimum 2 caractères')
})

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Requis'),
    password: z.string().min(6, 'Minimum 6 caractères'),
    passwordConfirmation: z.string().min(6, 'Minimum 6 caractères')
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirmation']
  })

const deleteSchema = z.object({
  password: z.string().min(1, 'Requis')
})

const profileState = reactive({
  name: authUser.value?.fullName || ''
})

watch(
  () => authUser.value?.fullName,
  (value) => {
    profileState.name = value || ''
  }
)

const passwordState = reactive({
  currentPassword: '',
  password: '',
  passwordConfirmation: ''
})

const deleteState = reactive({
  password: ''
})

const onUpdateProfile = async () => {
  profileLoading.value = true
  const result = await updateProfile(profileState.name)

  toast.add({
    title: result.success ? 'Profil mis à jour' : 'Erreur',
    description: result.data?.message,
    color: result.success ? 'success' : 'error'
  })

  profileLoading.value = false
}

const onChangePassword = async () => {
  passwordLoading.value = true
  const result = await changePassword(
    passwordState.currentPassword,
    passwordState.password,
    passwordState.passwordConfirmation
  )

  if (result.success) {
    passwordState.currentPassword = ''
    passwordState.password = ''
    passwordState.passwordConfirmation = ''
  }

  toast.add({
    title: result.success ? 'Mot de passe mis à jour' : 'Erreur',
    description: result.data?.message,
    color: result.success ? 'success' : 'error'
  })

  passwordLoading.value = false
}

const onDeleteAccount = async () => {
  deleteLoading.value = true
  const result = await deleteAccount(deleteState.password)

  if (!result.success) {
    toast.add({
      title: 'Erreur',
      description: result.data?.message || 'Impossible de supprimer le compte',
      color: 'error'
    })
  }

  deleteLoading.value = false
}
</script>
