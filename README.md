
# graphql-aot

[![NPM version](https://img.shields.io/npm/v/graphql-aot.svg?style=flat)](https://npmjs.com/package/graphql-aot) [![NPM downloads](https://img.shields.io/npm/dm/graphql-aot.svg?style=flat)](https://npmjs.com/package/graphql-aot) [![CircleCI](https://circleci.com/gh/egoist/graphql-aot/tree/master.svg?style=shield)](https://circleci.com/gh/egoist/graphql-aot/tree/master)  [![donate](https://img.shields.io/badge/$-donate-ff69b4.svg?maxAge=2592000&style=flat)](https://github.com/egoist/donate) [![chat](https://img.shields.io/badge/chat-on%20discord-7289DA.svg?style=flat)](https://chat.egoist.moe)

## Install

```bash
yarn add graphql-aot
```

## Usage

If you only want to work with the `import` statement, you will only need the webpack loader:

📝 __webpack.config.js__:

```js
module.exports = {
  entry: './index.js',
  module: {
    rules: [
      {
        type: 'json', // <== IMPORTANT!
        test: /\.gql$/,
        loader: 'graphql-aot/loader',
        options: {
          defaultClientOptions: {
            uri: 'https://api.graph.cool/simple/v1/cixmkt2ul01q00122mksg82pn'
          }
        }
      }
    ]
  }
}
```

📝 __query.gql__:

```graphql
{
  allPosts (first: 5) {
    id
    title
  }
}
```

📝 __index.js__:

```js
import { data } from './query.gql'

console.log(data.allPosts)
```

If you want to use inline graphql tag, you will __also__ need the babel plugin:

📝 __.babelrc.js__:

```js
module.exports = {
  plugins: [
    require.resolve('graphql-aot/babel')
  ]
}
```

📝 __index.js__:

```js
const { data } = graphql`
{
  allPosts (first: 5) {
    id
    title
  }
}
`

console.log(data.allPosts)
```

## API

### loaderOptions

#### defaultClientOptions

[Options for the default Apollo client](https://www.apollographql.com/docs/react/essentials/get-started.html#configuration).

#### client

Provide your own Apollo client instance.

#### getVariables

- __Type__: `function`

A function to get the variables you want to use with the [`client.query()`](https://www.apollographql.com/docs/react/api/apollo-client.html#ApolloClient.query) call.

The signature is: `loaderContext => any`

### babelOptions

#### tagName

- __Type__: `string`
- __Default__: `graphql`

#### importFrom

- __Type__: `string`
- __Default__: `undefined`

Ensure the tagged template literal identifier is imported from a module.

```js
import { gql } from 'a-module'

const result = gql`query { id }`
```

The above code will only work when you have following config for the babel plugin:

```js
{
  importFrom: 'a-module'
}
```

#### removeImportStatement

- __Type__: `boolean`
- __Default__: `true` when you set `importFrom` to a module name

Remove relevant import statement if necessary.

## Contributing

1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D


## Author

**graphql-aot** © [egoist](https://github.com/egoist), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by egoist with help from contributors ([list](https://github.com/egoist/graphql-aot/contributors)).

> [github.com/egoist](https://github.com/egoist) · GitHub [@egoist](https://github.com/egoist) · Twitter [@_egoistlily](https://twitter.com/_egoistlily)
