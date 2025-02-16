export default defineNuxtConfig({
  // Target: https://v3.nuxtjs.org/docs/directory-structure/nuxt.config#target
  target: 'static',

  // Global page headers: https://v3.nuxtjs.org/docs/directory-structure/nuxt.config#head
  app: {
    head: {
      title: 'menkyo-number-quiz',
      htmlAttrs: {
        lang: 'ja'
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: '' },
        { name: 'format-detection', content: 'telephone=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  // Global CSS: https://v3.nuxtjs.org/docs/directory-structure/nuxt.config#css
  css: [
  ],

  // Plugins to run before rendering page: https://v3.nuxtjs.org/docs/directory-structure/nuxt.config#plugins
  plugins: [
  ],

  // Auto import components: https://v3.nuxtjs.org/docs/directory-structure/nuxt.config#components
  components: true,

  // Modules for dev and build (recommended): https://v3.nuxtjs.org/docs/directory-structure/nuxt.config#buildmodules
  buildModules: [
    // https://v3.nuxtjs.org/docs/directory-structure/nuxt.config#typescript
    '@nuxt/typescript-build',
    // https://v3.nuxtjs.org/docs/directory-structure/nuxt.config#tailwindcss
    '@nuxtjs/tailwindcss',
  ],

  // Modules: https://v3.nuxtjs.org/docs/directory-structure/nuxt.config#modules
  modules: [
  ],

  // Build Configuration: https://v3.nuxtjs.org/docs/directory-structure/nuxt.config#build
  build: {
    // postcss の設定は削除 (@nuxtjs/tailwindcss が自動で設定)
    extend(config, { isDev, isClient }) {
      config.module.rules.push({
        test: /\.csv$/,
        loader: 'csv-loader',
        options: {
          dynamicTyping: true, // 数値と真偽値を自動変換
          header: false,       // 1行目をヘッダーとして扱わない
          skipEmptyLines: true,  // 空行をスキップ
        }
      });
    }
  },
  router: {
    base: '/menkyo-number-quiz/'
  }
})