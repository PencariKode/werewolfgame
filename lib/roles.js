import { auth } from '@clerk/nextjs/server'

/**
 * @param {'admin'|'user'} role String of role to check
 * @returns Boolean
 */
export const checkRole = async (role) => {
  const { sessionClaims } = await auth()
  return sessionClaims?.metadata.role === role
}
