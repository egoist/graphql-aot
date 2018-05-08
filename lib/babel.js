const qs = require('querystring')

const noopQuery = require.resolve('./noop.gql')

module.exports = ({ types: t }) => {
  return {
    name: 'graphql-aot',
    visitor: {
      TaggedTemplateExpression(
        path,
        {
          opts: {
            tagName = 'graphql',
            importFrom,
            removeImportStatement = true
          }
        }
      ) {
        if (path.node.tag.name !== tagName) return

        if (importFrom) {
          const binding = path.scope.getBinding(tagName)
          // Has no binding or binding is not a module
          if (!binding || binding.kind !== 'module') return
          const parentPath = binding.path.parentPath
          // Not import from specified module
          if (parentPath.node.source.value !== importFrom) return
          if (removeImportStatement) {
            // Remove the binding
            binding.path.remove()
            // Remove the declaration if no import specifiers
            if (parentPath.node.specifiers.length === 0) {
              parentPath.remove()
            }
          }
        }

        const query = path.get('quasi').evaluate().value
        path.replaceWith(
          t.memberExpression(
            t.callExpression(t.identifier('require'), [
              t.stringLiteral(
                `${noopQuery}?${qs.stringify({
                  query
                })}`
              )
            ]),
            t.identifier('default')
          )
        )
      }
    }
  }
}
