const qs = require('querystring')
const { getOptions } = require('loader-utils')
const gql = require('graphql-tag')
const { graphql } = require('graphql')

if (typeof global.fetch !== 'function') {
  global.fetch = require('node-fetch')
}

let cachedClient

function graphqlAotLoader(source) {
  const callback = this.async()

  if (this._module.type !== 'json') {
    return callback(
      new Error(`The type of the rule that uses graphql-aot loader must be set to "json" but got "${
        this._module.type
      }", example config:

rules: [
  {
    test: /\\.gql$/,
    type: 'json',
    loader: 'graphql-aot/loader',
    // ...
  }
]
`)
    )
  }

  const options = Object.assign({}, getOptions(this))
  const resourceQuery = qs.parse(this.resourceQuery.slice(1))
  const query = resourceQuery.query || source

  if (typeof options.useSchema === 'object') {
    const {
      schema,
      rootValues,
      getContext,
      getVariables,
      getOperationName,
      fieldResolvers
    } = options.useSchema
    return graphql(
      schema,
      query,
      rootValues,
      getContext && getContext(this),
      getVariables && getVariables(this),
      getOperationName && getOperationName(this),
      fieldResolvers
    )
      .then(data => callback(null, JSON.stringify(data)))
      .catch(callback)
  }

  let client = cachedClient || options.client
  if (!client) {
    const ApolloClient = require('apollo-boost').default
    client = new ApolloClient(options.defaultClientOptions)
  }
  cachedClient = client

  client
    .query({
      query: gql`
        ${query}
      `,
      variables: options.getVariables && options.getVariables(this)
    })
    .then(data => callback(null, JSON.stringify(data)))
    .catch(callback)
}

module.exports = graphqlAotLoader
