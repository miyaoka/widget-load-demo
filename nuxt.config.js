module.exports = {
  modules: [
    '@nuxtjs/apollo',
    [
      'nuxt-sass-resources-loader',
      [
        'node_modules/bootstrap/scss/_functions.scss',
        'node_modules/bootstrap/scss/_variables.scss',
        'node_modules/bootstrap/scss/_mixins.scss',
        '~/assets/css/_vars.scss'
      ]
    ]
  ],
  css: ['node_modules/bootstrap/scss/_reboot.scss', '~/assets/css/base.scss'],
  apollo: {
    clientConfigs: {
      default: '~/apollo/client-configs/default.js'
    }
  },
  env: {
    GH_READONLY_TOKEN: process.env.GH_READONLY_TOKEN,
    GH_REPO_OWNER: process.env.GH_REPO_OWNER,
    GH_REPO_NAME: process.env.GH_REPO_NAME
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'widget-load-demo',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
