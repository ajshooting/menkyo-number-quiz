// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config'
import dsv from 'rollup-plugin-dsv'

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
    plugins: [
      dsv()
    ],
    build: {
      rollupOptions: {
        external: ['stream'] // stream モジュールを外部化
      }
    }
  },

  compatibilityDate: '2025-02-17',
})