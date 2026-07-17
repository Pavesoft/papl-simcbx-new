import { console } from './plcLogger'

export const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms))

export function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  let timeout: NodeJS.Timeout | undefined
  const timeoutPromise = new Promise<never>((_, reject) => {
    timeout = setTimeout(() => {
      console.error(`[PLCService] ${label} timed out after ${ms}ms`)
      reject(new Error(`${label} timed out after ${ms}ms`))
    }, ms) as unknown as NodeJS.Timeout
  })

  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timeout) clearTimeout(timeout)
  })
}

export function toErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error)
}
