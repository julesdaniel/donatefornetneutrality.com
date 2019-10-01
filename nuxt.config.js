const RECAPTCHA_PUBLIC_KEY = "6LdrtFgUAAAAAIJT1yCDCFBu_bQNpCt8E1bfFyfG"

module.exports = {
  /*
  ** Headers of the page
  */
  head: {
    title: 'Donate for Net Neutrality',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'This is our last best chance to save net neutrality' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ],
    script: [
      { src: `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_PUBLIC_KEY}` }
    ]
  },
  css: [
    '~/assets/css/main.scss'
  ],
  modules: [
    'nuxt-sass-resources-loader'
  ],
  sassResources: [
    '~/assets/css/_setup.scss'
  ],
  /*
  ** Customize the progress bar color
  */
  loading: { color: '#26AFFF' },
  /*
  ** Environment configuration
  */
  env: {
    STRIPE_API_KEY: process.env.STRIPE_API_KEY || 'pk_test_KTyxkJ94nvaBujtk0VsUqZAN',
    PAYMENTS_API_URL: process.env.PAYMENTS_API_URL || 'https://payments-dev.fftf.xyz/',
    RECAPTCHA_PUBLIC_KEY: RECAPTCHA_PUBLIC_KEY
  },
  /*
  ** Router configuration
  */
  router: {
    scrollBehavior: function (to, from, savedPosition) {
      return { x: 0, y: 0 }
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** Run ESLint on save
    */
    extend (config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  },
  vendor: [
    'babel-polyfill'
  ],
  babel: {
    presets: [
      ['vue-app', {
          useBuiltIns: true,
          targets: { ie: 9, uglify: true }
        }
      ]
    ]
  },
  plugins: [
    { src: '~/plugins/analytics.js', ssr: false },
    { src: '~/plugins/hash-link-fix.js', ssr: false },
    { src: '~/plugins/ab-test-rotation.js', ssr: false }
  ]
}
