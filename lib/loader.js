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

  const handleData = data => {
    if (data.errors) {
      return callback(data.errors[0])
    }
    callback(null, `export default ${JSON.stringify(data.data, null, 2)}`)
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
      .then(handleData)
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
    .then(handleData)
    .catch(callback)
}

module.exports = graphqlAotLoader
