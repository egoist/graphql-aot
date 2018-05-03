const babel = require('@babel/core')

const LOADER_QUERY = '/lib/noop.gql?query=%0A%20%20%20%20allFiles%20%7B%0A%20%20%20%20%20%20id%0A%20%20%20%20%7D%0A%20%20'

test('main', () => {
  const { code } = babel.transform(`
  graphql\`
    allFiles {
      id
    }
  \`
  `, {
    babelrc: false,
    plugins: [
      require.resolve('../lib/babel')
    ]
  })

  expect(code).toContain(LOADER_QUERY)
})

describe('importFrom', () => {
  it('no import', () => {
    const { code } = babel.transform(`
  graphql\`
    allFiles {
      id
    }
  \`
  `, {
    babelrc: false,
    plugins: [
      [require.resolve('../lib/babel'), {
        importFrom: 'foo'
      }]
    ]
  })

    expect(code).toMatchSnapshot()
  })

  it('has import', () => {
    const { code } = babel.transform(`
  import { graphql } from 'foo'

  graphql\`
    allFiles {
      id
    }
  \`
  `, {
    babelrc: false,
    plugins: [
      [require.resolve('../lib/babel'), {
        importFrom: 'foo'
      }]
    ]
  })

    expect(code).toContain(LOADER_QUERY)
    expect(code).not.toContain(`import { graphql } from 'foo'`)
  })
})
