import { PortalUserRole, Prisma } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { prisma, serialize } from './prisma'
import { getSessionUser } from './auth.service'

export async function createUser(input: Prisma.PortalUserCreateInput & { password: string }) {
  const { operatorId, userName, password } = input

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.portalUser.create({
    data: {
      userName,
      operatorId,
      autoMode: input.autoMode,
      loginConfig: input.loginConfig,
      modelConfig: input.modelConfig,
      reports: input.reports,
      manual: input.manual,
      userRole: input.userRole,
      login: {
        create: {
          password: hashedPassword
        }
      }
    },
    include: { login: true }
  })

  return serialize(user)
}

export async function updateUser(
  input: Prisma.PortalUserUpdateInput & { id: string; password?: string }
) {
  const { id, operatorId, userName, password } = input

  if (password?.length) {
    const hashedPassword = await bcrypt.hash(password, 10)
    const existing = await prisma.portalUser.findUnique({
      where: { id },
      select: { login: { select: { id: true } } }
    })

    if (existing?.login?.id) {
      await prisma.portalUserLogin.update({
        where: { id: existing.login.id },
        data: { password: hashedPassword }
      })
    }
  }

  const user = await prisma.portalUser.update({
    where: { id },
    data: {
      userName,
      operatorId,
      autoMode: input.autoMode,
      loginConfig: input.loginConfig,
      modelConfig: input.modelConfig,
      reports: input.reports,
      manual: input.manual,
      userRole: input.userRole,
      cycleReset: input.cycleReset
    }
  })

  return serialize(user)
}

/** Applies the given fields to ALL users — used to set the globally selected model. */
export async function updateAllUsers(input: Prisma.PortalUserUpdateInput) {
  return serialize(await prisma.portalUser.updateMany({ data: input }))
}

/** Role-scoped listing: admins see admins+operators, operators see operators, super admins see everyone. */
export async function listUsers() {
  const sessionUser = getSessionUser()

  if (sessionUser?.userRole === PortalUserRole.ADMIN) {
    return serialize(
      await prisma.portalUser.findMany({
        where: { userRole: { in: [PortalUserRole.ADMIN, PortalUserRole.OPERATOR] } }
      })
    )
  } else if (sessionUser?.userRole === PortalUserRole.OPERATOR) {
    return serialize(
      await prisma.portalUser.findMany({
        where: { userRole: PortalUserRole.OPERATOR }
      })
    )
  }
  return serialize(await prisma.portalUser.findMany())
}

export async function getUserById(id: string) {
  return serialize(await prisma.portalUser.findUnique({ where: { id } }))
}

export async function deleteUser(id: string) {
  const user = await prisma.portalUser.findUnique({
    where: { id },
    select: { login: { select: { id: true } } }
  })

  if (!user) {
    throw new Error('Portal user not found')
  }

  if (user.login?.id) {
    await prisma.portalUserLogin.delete({ where: { id: user.login.id } })
  }

  return serialize(await prisma.portalUser.delete({ where: { id } }))
}
