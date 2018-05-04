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
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: [/node_modules/],
        options: {
          babelrc: false,
          plugins: [
            require.resolve('../../babel')
          ]
        }
      }
    ]
  },
  plugins: [
    new HTML()
  ]
}
