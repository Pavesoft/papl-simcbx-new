import { Prisma } from '@prisma/client'
import { prisma, serialize } from './prisma'

export async function createModelSerialNumber(input: Prisma.ModelSerialNumberCreateInput) {
  return serialize(await prisma.modelSerialNumber.create({ data: input }))
}

export async function listModelSerialNumbers(modelId?: string) {
  return serialize(
    await prisma.modelSerialNumber.findMany({
      where: { modelId }
    })
  )
}

export async function getModelSerialNumberById(id: number) {
  return serialize(await prisma.modelSerialNumber.findUnique({ where: { id } }))
}

/**
 * Same-day rollover semantics from the old server:
 * - latest record has today's date -> update only the serial number
 * - latest record is older -> move it to the new date with the new serial number
 * - no record -> create one
 */
export async function updateModelSerialNumber(input: {
  modelId: string
  date: string | Date
  serialNumber: string
}) {
  const { modelId, date, serialNumber } = input

  if (typeof modelId !== 'string' || typeof serialNumber !== 'string') {
    throw new Error('modelId and serialNumber must be strings')
  }

  const latest = await prisma.modelSerialNumber.findFirst({
    where: { modelId },
    orderBy: { date: 'desc' }
  })

  if (
    latest &&
    latest.date.toISOString().slice(0, 10) === new Date(date).toISOString().slice(0, 10)
  ) {
    return serialize(
      await prisma.modelSerialNumber.update({
        where: { id: latest.id },
        data: { serialNumber }
      })
    )
  } else if (latest) {
    return serialize(
      await prisma.modelSerialNumber.update({
        where: { id: latest.id },
        data: { date: new Date(date), serialNumber }
      })
    )
  }
  return serialize(
    await prisma.modelSerialNumber.create({
      data: { modelId, date: new Date(date), serialNumber }
    })
  )
}
