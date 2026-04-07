import { z } from 'zod'

const email = z.email()

const password = z
  .string()
  .min(6, 'Password must be at least 6 characters')
  .max(100)

const fullName = z
  .string()
  .min(2, 'Name is too short')
  .max(100)

/**
 * 🧑‍💼 Roles (sync with DB)
 */
export const roleEnum = z.enum(['member', 'core', 'admin'])

/**
 * 📝 SIGN UP
 */
export const signUpSchema = z.object({
  email,
  password,
  full_name: fullName
})

export type SignUpInput = z.infer<typeof signUpSchema>

/**
 * 🔑 LOGIN
 */
export const loginSchema = z.object({
  email,
  password
})

export type LoginInput = z.infer<typeof loginSchema>

/**
 * 👤 PROFILE UPDATE
 */
export const profileUpdateSchema = z.object({
  full_name: fullName.optional(),
  avatar_url: z.string().url().optional(),
})

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>

/**
 * 🔐 CHANGE PASSWORD (optional)
 */
export const changePasswordSchema = z.object({
  current_password: password,
  new_password: password
})

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>