import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { IPC } from '@shared/ipc.types'
import type { ModelSerialNumber, ModelSetting, PartData, PortalUser, Prisma } from '@prisma/client'
import type {
  DbResult,
  ExportToExcelResult,
  LaserMarkResult,
  LaserReadyResult,
  PartDataListParams,
  PLCData,
  PLCReadMultipleResult,
  PLCReadResult,
  PLCStatus,
  ScannerStatusResult,
  ScannerTriggerResult
} from '@shared/ipc.types'

function subscribe<T>(channel: string) {
  return (callback: (payload: T) => void): (() => void) => {
    const listener = (_e: unknown, payload: T): void => callback(payload)
    ipcRenderer.on(channel, listener)
    return () => ipcRenderer.removeListener(channel, listener)
  }
}

// Custom APIs for renderer — mirrors the old tRPC router names so call sites
// port mechanically (trpc.adminUser.byId.query(x) -> window.api.adminUser.byId(x)).
const api = {
  app: {
    exit: (): Promise<void> => ipcRenderer.invoke(IPC.APP_EXIT)
  },

  auth: {
    login: (input: { username: string; password: string }): Promise<DbResult<PortalUser>> =>
      ipcRenderer.invoke(IPC.AUTH_LOGIN, input),
    logout: (): Promise<DbResult<void>> => ipcRenderer.invoke(IPC.AUTH_LOGOUT),
    getSession: (): Promise<DbResult<PortalUser | null>> => ipcRenderer.invoke(IPC.AUTH_GET_SESSION)
  },

  adminUser: {
    create: (
      input: Prisma.PortalUserCreateInput & { password: string }
    ): Promise<DbResult<PortalUser>> => ipcRenderer.invoke(IPC.USER_CREATE, input),
    update: (
      input: Prisma.PortalUserUpdateInput & { id: string; password?: string }
    ): Promise<DbResult<PortalUser>> => ipcRenderer.invoke(IPC.USER_UPDATE, input),
    updateModelSettings: (
      input: Prisma.PortalUserUpdateInput
    ): Promise<DbResult<{ count: number }>> =>
      ipcRenderer.invoke(IPC.USER_UPDATE_MODEL_SETTINGS, input),
    list: (): Promise<DbResult<PortalUser[]>> => ipcRenderer.invoke(IPC.USER_LIST),
    byId: (input: { id: string }): Promise<DbResult<PortalUser | null>> =>
      ipcRenderer.invoke(IPC.USER_BY_ID, input),
    delete: (input: { id: string }): Promise<DbResult<PortalUser>> =>
      ipcRenderer.invoke(IPC.USER_DELETE, input)
  },

  modelSettings: {
    create: (input: Prisma.ModelSettingCreateInput): Promise<DbResult<ModelSetting>> =>
      ipcRenderer.invoke(IPC.MODEL_SETTING_CREATE, input),
    list: (): Promise<DbResult<ModelSetting[]>> => ipcRenderer.invoke(IPC.MODEL_SETTING_LIST),
    byId: (input: { id: string }): Promise<DbResult<ModelSetting | null>> =>
      ipcRenderer.invoke(IPC.MODEL_SETTING_BY_ID, input),
    update: (
      input: Prisma.ModelSettingUpdateInput & { id: string }
    ): Promise<DbResult<ModelSetting>> => ipcRenderer.invoke(IPC.MODEL_SETTING_UPDATE, input),
    delete: (input: { id: string }): Promise<DbResult<ModelSetting>> =>
      ipcRenderer.invoke(IPC.MODEL_SETTING_DELETE, input)
  },

  partData: {
    create: (input: Prisma.PartDataCreateInput): Promise<DbResult<PartData>> =>
      ipcRenderer.invoke(IPC.PART_DATA_CREATE, input),
    list: (
      input: PartDataListParams
    ): Promise<DbResult<(PartData & { updatedBy: { userName: string } | null })[]>> =>
      ipcRenderer.invoke(IPC.PART_DATA_LIST, input),
    byId: (input: { id: number }): Promise<DbResult<PartData | null>> =>
      ipcRenderer.invoke(IPC.PART_DATA_BY_ID, input),
    update: (input: Prisma.PartDataUpdateInput & { id: number }): Promise<DbResult<PartData>> =>
      ipcRenderer.invoke(IPC.PART_DATA_UPDATE, input),
    delete: (input: { id: number }): Promise<DbResult<PartData>> =>
      ipcRenderer.invoke(IPC.PART_DATA_DELETE, input),
    exportToExcel: (input: PartDataListParams): Promise<DbResult<ExportToExcelResult>> =>
      ipcRenderer.invoke(IPC.PART_DATA_EXPORT, input)
  },

  modelSerialNumber: {
    create: (input: Prisma.ModelSerialNumberCreateInput): Promise<DbResult<ModelSerialNumber>> =>
      ipcRenderer.invoke(IPC.SERIAL_CREATE, input),
    list: (input?: { modelId?: string }): Promise<DbResult<ModelSerialNumber[]>> =>
      ipcRenderer.invoke(IPC.SERIAL_LIST, input),
    byId: (input: { id: number }): Promise<DbResult<ModelSerialNumber | null>> =>
      ipcRenderer.invoke(IPC.SERIAL_BY_ID, input),
    update: (input: {
      modelId: string
      date: string | Date
      serialNumber: string
    }): Promise<DbResult<ModelSerialNumber>> => ipcRenderer.invoke(IPC.SERIAL_UPDATE, input)
  },

  scanner: {
    trigger: (): Promise<ScannerTriggerResult> => ipcRenderer.invoke(IPC.SCANNER_TRIGGER),
    status: (): Promise<ScannerStatusResult> => ipcRenderer.invoke(IPC.SCANNER_STATUS),
    stop: (): Promise<{ success: boolean; error?: string }> => ipcRenderer.invoke(IPC.SCANNER_STOP),
    onConnection: subscribe<boolean>(IPC.SCANNER_CONNECTION)
  },

  laser: {
    ready: (): Promise<LaserReadyResult> => ipcRenderer.invoke(IPC.LASER_READY),
    mark: (input: {
      template: string
      markName: string
      content: string
    }): Promise<LaserMarkResult> => ipcRenderer.invoke(IPC.LASER_MARK, input),
    onStatus: subscribe<string>(IPC.LASER_STATUS)
  },

  plc: {
    connect: (): Promise<boolean> => ipcRenderer.invoke(IPC.PLC_CONNECT),
    disconnect: (): Promise<boolean> => ipcRenderer.invoke(IPC.PLC_DISCONNECT),
    getStatus: (): Promise<PLCStatus> => ipcRenderer.invoke(IPC.PLC_GET_STATUS),
    read: (address: string): Promise<PLCReadResult> => ipcRenderer.invoke(IPC.PLC_READ, address),
    write: (address: string, value: unknown): Promise<boolean> =>
      ipcRenderer.invoke(IPC.PLC_WRITE, address, value),
    readMultiple: (address: string, length: number): Promise<PLCReadMultipleResult> =>
      ipcRenderer.invoke(IPC.PLC_READ_MULTIPLE, address, length),
    writeMultiple: (address: string, values: unknown[] | unknown): Promise<boolean> =>
      ipcRenderer.invoke(IPC.PLC_WRITE_MULTIPLE, address, values),
    onStatus: subscribe<PLCStatus>(IPC.PLC_STATUS),
    onData: subscribe<PLCData>(IPC.PLC_DATA)
  }
}

export type Api = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
