import gql from 'graphql-tag'

export default gql`
  type Mutation {
    mutationTest(test: Boolean): Boolean
    loginMutation(email: String!, password: String!): LoginResponse
  }
  type LoginResponse {
    token: String
    user: User
  }
  type User {
    _id: ID
    name: String
    email: String
    company: String
    updatedAt: String
  }
`
