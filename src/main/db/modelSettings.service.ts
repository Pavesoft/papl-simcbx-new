import { Prisma } from '@prisma/client'
import { prisma, serialize } from './prisma'
import { getSessionUser } from './auth.service'
import { logModelSettingUpdate } from './modelSettingLog'

// Human-readable labels for the unique fields on ModelSetting, used to turn
// Prisma's raw P2002 error into a message the operator can actually act on.
const UNIQUE_FIELD_LABELS: Record<string, string> = {
  partNo: 'part number',
  modelName: 'model name',
  programNo: 'program number'
}

/**
 * Prisma throws a verbose, internal-looking error on a unique-constraint
 * violation (code P2002). Translate it into a clean message that names the
 * duplicated field, e.g. "A model with this part number already exists."
 * Any other error is rethrown untouched.
 */
function toFriendlyDbError(err: unknown): Error {
  if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
    const target = err.meta?.target
    const fields = Array.isArray(target) ? target : typeof target === 'string' ? [target] : []
    const label = fields.map((f) => UNIQUE_FIELD_LABELS[f] ?? f).join(', ')
    return new Error(
      label
        ? `A model with this ${label} already exists. Please use a unique ${label}.`
        : 'A model with these details already exists.'
    )
  }
  return err instanceof Error ? err : new Error(String(err))
}

export async function createModelSetting(input: Prisma.ModelSettingCreateInput) {
  try {
    return serialize(await prisma.modelSetting.create({ data: input }))
  } catch (err) {
    throw toFriendlyDbError(err)
  }
}

export async function listModelSettings() {
  return serialize(await prisma.modelSetting.findMany())
}

export async function getModelSettingById(id: string) {
  return serialize(await prisma.modelSetting.findUnique({ where: { id } }))
}

export async function updateModelSetting(input: Prisma.ModelSettingUpdateInput & { id: string }) {
  const { id, ...data } = input

  let updated: Awaited<ReturnType<typeof prisma.modelSetting.update>>
  try {
    updated = await prisma.modelSetting.update({
      where: { id },
      data
    })
  } catch (err) {
    throw toFriendlyDbError(err)
  }

  logModelSettingUpdate({
    id,
    updatedFields: data,
    result: updated,
    userName: getSessionUser()?.userName
  })

  return serialize(updated)
}

export async function deleteModelSetting(id: string) {
  return serialize(await prisma.modelSetting.delete({ where: { id } }))
}
