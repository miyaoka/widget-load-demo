const { createApolloFetch } = require('apollo-fetch')
const fs = require('fs-extra')
const path = require('path')

const query = fs.readFileSync(
  path.resolve('apollo/queries/getIssues.gql'),
  'utf8'
)

const defaults = {
  path: 'contents.json'
}

const apolloFetch = createApolloFetch({
  uri: 'https://api.github.com/graphql'
})

apolloFetch.use(({ request, options }, next) => {
  options.headers = {
    ...options.headers,
    authorization: `Bearer ${process.env.GH_READONLY_TOKEN}`
  }
  next()
})

const fetchContents = async () => {
  try {
    let totalNodes = []
    let endCursor = null
    let hasNextPage = false
    do {
      const { data } = await apolloFetch({
        query,
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
    } while (hasNextPage)

    return totalNodes
  } catch (err) {
    console.error(err)
  }
}

module.exports = async function contentsModule(moduleOptions) {
  const options = {
    ...defaults,
    ...this.options.contents,
    ...moduleOptions
  }

  const contents = await fetchContents()

  this.options.build.plugins.push({
    apply(compiler) {
      compiler.plugin('emit', (compilation, cb) => {
        const json = JSON.stringify(contents)
        compilation.assets[options.path] = {
          source: () => json,
          size: () => json.length
        }
        cb()
      })
    }
  })

  this.options.generate.routes = contents.map((content) => ({
    route: `posts/${content.number}`,
    payload: content
  }))
}
