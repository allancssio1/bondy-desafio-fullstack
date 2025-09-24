import bcrypt from 'bcrypt'
import { User } from '../../../models/User'
import jwt from 'jsonwebtoken'

export const login = async (
  _: any,
  args: { email: string; password: string }
) => {
  const user = await User.findOne({ email: args.email }).exec()

  if (!user) {
    throw new Error('Credenciais inválidas')
  }

  const isPasswordValid = await bcrypt.compare(args.password, user.password)

  if (!isPasswordValid) {
    throw new Error('Credenciais inválidas')
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    'secret-bondy-12345',
    {
      expiresIn: '1d',
    }
  )

  return {
    token,
    user: user.toObject(),
  }
}
