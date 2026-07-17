import { IPC } from '@shared/ipc.types'
import { handleWithEnvelope } from './envelope'
import * as auth from '../db/auth.service'
import * as users from '../db/users.service'
import * as modelSettings from '../db/modelSettings.service'
import * as partData from '../db/partData.service'
import * as serials from '../db/modelSerialNumber.service'

export function registerDbIpc(): void {
  // auth
  handleWithEnvelope(IPC.AUTH_LOGIN, (input: { username: string; password: string }) =>
    auth.login(input.username, input.password)
  )
  handleWithEnvelope(IPC.AUTH_LOGOUT, () => auth.logout())
  handleWithEnvelope(IPC.AUTH_GET_SESSION, () => auth.getSessionUser())

  // admin users
  handleWithEnvelope(IPC.USER_CREATE, users.createUser)
  handleWithEnvelope(IPC.USER_UPDATE, users.updateUser)
  handleWithEnvelope(IPC.USER_UPDATE_MODEL_SETTINGS, users.updateAllUsers)
  handleWithEnvelope(IPC.USER_LIST, users.listUsers)
  handleWithEnvelope(IPC.USER_BY_ID, (input: { id: string }) => users.getUserById(input.id))
  handleWithEnvelope(IPC.USER_DELETE, (input: { id: string }) => users.deleteUser(input.id))

  // model settings
  handleWithEnvelope(IPC.MODEL_SETTING_CREATE, modelSettings.createModelSetting)
  handleWithEnvelope(IPC.MODEL_SETTING_LIST, modelSettings.listModelSettings)
  handleWithEnvelope(IPC.MODEL_SETTING_BY_ID, (input: { id: string }) =>
    modelSettings.getModelSettingById(input.id)
  )
  handleWithEnvelope(IPC.MODEL_SETTING_UPDATE, modelSettings.updateModelSetting)
  handleWithEnvelope(IPC.MODEL_SETTING_DELETE, (input: { id: string }) =>
    modelSettings.deleteModelSetting(input.id)
  )

  // part data
  handleWithEnvelope(IPC.PART_DATA_CREATE, partData.createPartData)
  handleWithEnvelope(IPC.PART_DATA_LIST, partData.listPartData)
  handleWithEnvelope(IPC.PART_DATA_BY_ID, (input: { id: number }) =>
    partData.getPartDataById(input.id)
  )
  handleWithEnvelope(IPC.PART_DATA_UPDATE, partData.updatePartData)
  handleWithEnvelope(IPC.PART_DATA_DELETE, (input: { id: number }) =>
    partData.deletePartData(input.id)
  )

  // model serial numbers
  handleWithEnvelope(IPC.SERIAL_CREATE, serials.createModelSerialNumber)
  handleWithEnvelope(IPC.SERIAL_LIST, (input: { modelId?: string } = {}) =>
    serials.listModelSerialNumbers(input?.modelId)
  )
  handleWithEnvelope(IPC.SERIAL_BY_ID, (input: { id: number }) =>
    serials.getModelSerialNumberById(input.id)
  )
  handleWithEnvelope(IPC.SERIAL_UPDATE, serials.updateModelSerialNumber)
}
