<script setup lang="ts">
const colorMode = useColorMode()

const isDark = computed({
  get: () => colorMode.value === 'dark',
  set: (value: boolean) => {
    colorMode.preference = value ? 'dark' : 'light'
  }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-12">
    <div class="absolute top-4 right-4">
      <ClientOnly>
        <UButton
          :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
          color="neutral"
          variant="ghost"
          aria-label="Basculer le thème"
          @click="isDark = !isDark"
        />
      </ClientOnly>
    </div>

    <div class="w-full max-w-sm">
      <div class="mb-8 text-center space-y-1">
        <p class="text-sm font-medium tracking-wide text-muted">
          Starter Kit
        </p>
      </div>

      <slot />
    </div>
  </div>
</template>
