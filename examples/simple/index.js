import { data } from './query.gql'

const { data: { allUsers } } = graphql`
{
  allUsers (first: 5) {
    lastName
  }
}
`

console.log('posts', data.allPosts)
console.log('users', allUsers)
