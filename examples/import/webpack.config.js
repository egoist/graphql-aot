const path = require('path')
const HTML = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  entry: path.join(__dirname, 'index.js'),
  output: {
    path: '/random/'
  },
  module: {
    rules: [
      {
        test: /\.gql$/,
        type: 'json',
        loader: require.resolve('../../loader'),
        options: {
          defaultClientOptions: {
            uri: 'https://api.graph.cool/simple/v1/cixmkt2ul01q00122mksg82pn'
          }
        }
      }
    ]
  },
  plugins: [
    new HTML()
  ]
}
