const path = require('path')
const { promisify } = require('util')
const webpack = require('webpack')

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
