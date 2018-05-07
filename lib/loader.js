const qs = require('querystring')
const { getOptions } = require('loader-utils')
const gql = require('graphql-tag')

if (typeof global.fetch !== 'function') {
  global.fetch = require('node-fetch')
}

let cachedClient

function graphqlAotLoader(source) {
  const callback = this.async()

  if (this._module.type !== 'json') {
    return callback(new Error(`The type of the rule that uses graphql-aot loader must be set to "json" but got "${this._module.type}", example config:

rules: [
  {
    test: /\\.gql$/,
    type: 'json',
    loader: 'graphql-aot/loader',
    // ...
  }
]
`))
  }

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
      `,
      variables: options.getVariables && options.getVariables(this)
    })
    .then(data =>
      callback(null, JSON.stringify(data, null, 2))
    )
    .catch(callback)
}

module.exports = graphqlAotLoader
