const path = require('path')
const { promisify } = require('util')
const webpack = require('webpack')
const { makeExecutableSchema } = require('graphql-tools')

jest.setTimeout(10000)

const loader = require.resolve('../lib/loader')

test('main', async () => {
  const MFS = webpack.MemoryOutputFileSystem
  const mfs = new MFS()
  const compiler = webpack({
    entry: path.join(__dirname, 'fixtures/loader-only', 'index.js'),
    mode: 'development',
    devtool: false,
    output: {
      path: '/tmp/'
    },
    module: {
      rules: [
        {
          test: /\.gql$/,
          type: 'json',
          loader,
          options: {
            defaultClientOptions: {
              uri: 'https://api.graph.cool/simple/v1/cjc32dadu12pf0184otnrztnq'
            }
          }
        }
      ]
    }
  })
  compiler.outputFileSystem = mfs

  const stats = await promisify(compiler.run.bind(compiler))()

  if (stats.hasErrors()) {
    throw new Error(stats.toString('errors-only'))
  }

  expect(mfs.readFileSync('/tmp/main.js', 'utf8')).toMatchSnapshot()
})

test('use schema', async () => {
  const MFS = webpack.MemoryOutputFileSystem
  const mfs = new MFS()
  const compiler = webpack({
    entry: path.join(__dirname, 'fixtures/use-schema', 'index.js'),
    mode: 'development',
    devtool: false,
    output: {
      path: '/tmp/'
    },
    module: {
      rules: [
        {
          test: /\.gql$/,
          type: 'json',
          loader,
          options: {
            useSchema: {
              schema: makeExecutableSchema({
                typeDefs: `type Query { hello(name: String): String }`,
                resolvers: {
                  Query: {
                    hello: (root, args, context) => {
                      return `hello ${args.name} ${context.type}`
                    }
                  }
                }
              }),
              getContext() {
                return {
                  type: 'hmm'
                }
              }
            }
          }
        }
      ]
    }
  })
  compiler.outputFileSystem = mfs

  const stats = await promisify(compiler.run.bind(compiler))()

  if (stats.hasErrors()) {
    throw new Error(stats.toString('errors-only'))
  }

  expect(mfs.readFileSync('/tmp/main.js', 'utf8')).toMatchSnapshot()
})
