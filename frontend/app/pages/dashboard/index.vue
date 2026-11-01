<template>
  <div class="space-y-6 max-w-lg">
    <div class="space-y-2">
      <h1 class="text-2xl font-semibold tracking-tight">
        Dashboard
      </h1>
      <p class="text-sm text-muted">
        Tu es connecté. Commence à construire ton produit ici.
      </p>
    </div>

    <div class="space-y-3 text-sm">
      <p>
        <span class="text-muted">Nom</span>
        <br>
        {{ authUser?.fullName || '—' }}
      </p>
      <p>
        <span class="text-muted">Email</span>
        <br>
        {{ authUser?.email }}
      </p>
    </div>

    <UButton
      to="/dashboard/account"
      color="neutral"
      variant="outline"
    >
      Gérer mon compte
    </UButton>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'dashboard'
})

const { authUser } = useAuth()
</script>
