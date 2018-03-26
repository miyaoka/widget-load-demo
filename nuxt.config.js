const { createApolloFetch } = require('apollo-fetch')

module.exports = {
  generate: {
    async routes() {
      const apolloFetch = createApolloFetch({
        uri: 'https://api.github.com/graphql'
      })

      apolloFetch.use(({ request, options }, next) => {
        if (!options.headers) {
          options.headers = {} // Create the headers object if needed.
        }
        options.headers['authorization'] = `Bearer ${
          process.env.GH_READONLY_TOKEN
        }`
        next()
      })

      try {
        let totalNodes = []
        let endCursor = null
        let hasNextPage = false
        do {
          const { data } = await apolloFetch({
            query: `query getIssues(
            $repoOwner: String!
            $repoName: String!
            $fetchIssuePerPage: Int = 5
            $endCursor: String
          ) {
            repository(owner: $repoOwner, name: $repoName) {
              name
              description
              issues(
                orderBy: { field: CREATED_AT, direction: DESC }
                first: $fetchIssuePerPage
                after: $endCursor
              ) {
                totalCount
                pageInfo {
                  endCursor
                  hasNextPage
                }
                nodes {
                  author {
                    avatarUrl
                    login
                    resourcePath
                    url
                  }
                  id
                  number
                  title
                  body
                  createdAt
                  updatedAt
                  url
                }
              }
            }
          }
          `,
            variables: {
              repoOwner: process.env.GH_REPO_OWNER,
              repoName: process.env.GH_REPO_NAME,
              fetchIssuePerPage: 100,
              endCursor: endCursor
            }
          })

          const { totalCount, nodes, pageInfo, append } = data.repository.issues
          endCursor = pageInfo.endCursor
          hasNextPage = pageInfo.hasNextPage

          totalNodes = [...totalNodes, ...nodes]
          console.log(totalNodes.length, pageInfo.endCursor)
        } while (hasNextPage)

        return totalNodes.map((node) => ({
          route: `posts/${node.number}`,
          payload: node
        }))
      } catch (err) {
        console.error(err)
      }
    }
  },
  plugins: ['~/plugins/twitter-widgets'],
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
    script: [
      {
        type: 'text/javascript',
        src: '//platform.twitter.com/widgets.js',
        async: true
      }
    ],
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
