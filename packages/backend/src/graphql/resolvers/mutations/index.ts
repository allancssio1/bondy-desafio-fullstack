import { GraphQLResolveInfo } from 'graphql'
import { mutationTest } from './mutationTest'
import { login } from './login'

export default {
  mutationTest: (
    parent: any,
    args: any,
    context: any,
    info: GraphQLResolveInfo
  ) => mutationTest(parent, args, context, info),
  loginMutation: (parent: any, args: { email: string; password: string }) =>
    login(parent, args),
}
