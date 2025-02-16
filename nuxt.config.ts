// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss'
  ],

  app: {
    baseURL: '/menkyo-number-quiz/'
  },

  typescript: {
    shim: false
  },

  vite: {
  },

  compatibilityDate: '2025-02-17',
})