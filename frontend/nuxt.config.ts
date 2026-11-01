// https://nuxt.com/docs/api/configuration/nuxt-config
const apiBase = process.env.NUXT_PUBLIC_API || 'http://localhost:3333'
const appBase = process.env.NUXT_PUBLIC_APP || 'http://localhost:3000'

export default defineNuxtConfig({

  modules: ['@nuxt/ui'],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      appBase,
      apiBase
    }
  },

  compatibilityDate: '2026-06-30',

  nitro: {
    routeRules: {
      '/api/**': {
        proxy: {
          to: `${apiBase}/api/**`
        }
      }
    }
  }
})
