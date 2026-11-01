<script setup lang="ts">
useHead({
  meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
  htmlAttrs: { lang: 'fr' }
})

useSeoMeta({
  title: 'Starter Kit',
  description: 'Starter Nuxt 4 + AdonisJS pour applications SaaS'
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
