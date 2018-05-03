const qs = require('querystring')
const { getOptions } = require('loader-utils')
const gql = require('graphql-tag')

if (typeof global.fetch !== 'function') {
  global.fetch = require('node-fetch')
}

let cachedClient

function graphqlAotLoader(source) {
  const callback = this.async()

  const options = Object.assign({}, getOptions(this))
  const resourceQuery = qs.parse(this.resourceQuery.slice(1))

  let client = cachedClient || options.client
  if (!client) {
    const ApolloClient = require('apollo-boost').default
    client = new ApolloClient(options.defaultClientOptions)
  }
  cachedClient = client

  client
    .query({
      query: gql`
        ${resourceQuery.query || source}
      `
    })
    .then(data =>
      callback(null, `export default ${JSON.stringify(data, null, 2)}`)
    )
    .catch(callback)
}

module.exports = graphqlAotLoader
