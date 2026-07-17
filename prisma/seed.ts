// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding data...')

  const existing = await prisma.portalUser.findFirst({
    where: { userRole: 'SUPER_ADMIN' }
  })

  if (existing) {
    console.log('Super Admin already exists.')
    return
  }

  const superAdmin = await prisma.portalUser.create({
    data: {
      userName: 'super',
      operatorId: 'SUPER1',
      userRole: 'SUPER_ADMIN',
      autoMode: true,
      loginConfig: true,
      manual: true,
      modelConfig: true,
      reports: true,
      login: {
        create: {
          password: await hash('12345', 10)
        }
      }
    }
  })

  console.log('✅ Super Admin created:', superAdmin.userName)
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
