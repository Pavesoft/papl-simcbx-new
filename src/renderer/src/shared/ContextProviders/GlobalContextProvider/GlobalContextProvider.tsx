import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import { PLC_MAPPINGS } from '@shared/plc.const'
import { PLCAddressManager } from '@shared/plc-address.utils'
import type { PLCData } from '@shared/plc-address.utils'
import _ from 'lodash'
import type { ModelSetting, PortalUser } from '@prisma/client'
import { api, unwrap } from '../../../api'
import { useLocation } from 'react-router-dom'
import { useDisclosure } from '@mantine/hooks'
import { Button, Flex, Modal } from '@mantine/core'
import { BodyTextSemiBold, HeadingLargeSemiBold } from '../../../components/AllText/Text'
import { IconAlertHexagon } from '@tabler/icons-react'

type GlobalContextType = {
  connectAllWs: () => void
  readValueFromPlc: (address: string) => number | boolean | null
  writeMultipleValuesToPlc: (writes: { address: string; value: number | boolean }[]) => void
  allItemsPlc: PLCData | object
  plcManager: PLCAddressManager
  userDetails: PortalUser | undefined
  setSessionUser: (user: PortalUser | null) => void
  heartBeatStatus: boolean
  currentMode: string
  selectedModel: string | null
  setSelectedModel: React.Dispatch<React.SetStateAction<string | null>>
  selectedModelDetails: ModelSetting | null
  setSelectedModelDetails: React.Dispatch<React.SetStateAction<ModelSetting | null>>
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

/**
 * A single Modbus timeout tears down the socket, so `connected` briefly flips
 * to false and the reconnect loop restores it within a few seconds. Only show
 * the disconnect modal if the PLC stays down past this grace window, otherwise
 * transient blips make the modal flicker/appear continuously.
 */
const DISCONNECT_MODAL_GRACE_MS = 6000

export function GlobalContextProvider({ children }: { children: ReactNode }) {
  const [heartBeatStatus, setHeartBeatStatus] = useState<boolean>(false)
  const [allItemsPlc, setAllItemsPlc] = useState<PLCData | object>({})
  const [userDetails, setUserDetails] = useState<PortalUser>()
  const [currentMode, setCurrentMode] = useState<'manual' | 'auto' | 'none'>('none')
  const [selectedModel, setSelectedModel] = useState<string | null>(
    userDetails?.selectedModel || ''
  )
  const [selectedModelDetails, setSelectedModelDetails] = useState<ModelSetting | null>(null)
  const [opened, { open, close }] = useDisclosure(false)
  const allItemsPlcRef = useRef({})
  const hasModeBeenSentRef = useRef(false)
  const disconnectModalTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const plcManager = new PLCAddressManager(PLC_MAPPINGS)
  const location = useLocation()

  const readValueFromPlc = (address: string) => {
    const readData = plcManager.readValue(address, allItemsPlc as PLCData)
    return readData
  }

  const writeMultipleValuesToPlc = (writes: { address: string; value: number | boolean }[]) => {
    const preparedWrites = plcManager.prepareWriteMultiple(
      writes.map((w) => w.address),
      writes.map((w) => w.value)
    )

    // Filter to ensure each write is scalar
    const filteredWrites = preparedWrites.filter(
      (w) => typeof w.value === 'number' || typeof w.value === 'boolean'
    )

    // Writes are serialized in the main process (single Modbus transaction mutex).
    for (const write of filteredWrites) {
      api.plc.write(write.address, write.value).catch((err) => {
        console.error('PLC write failed:', write.address, err)
      })
    }
  }

  const connectAllWs = () => {
    api.plc.connect().catch((err) => console.error('PLC connect failed:', err))
  }

  const sendModeToPlc = (mode: 'manual' | 'auto' | 'none') => {
    if (!sessionStorage.getItem('user')) {
      console.warn("Mode won't set in logged out state")
      return
    }
    if (mode === 'auto') {
      writeMultipleValuesToPlc([
        {
          address: 'M37',
          value: true
        }
      ])
    } else if (mode === 'manual') {
      writeMultipleValuesToPlc([
        {
          address: 'M1',
          value: true
        }
      ])
    } else if (mode === 'none') {
      writeMultipleValuesToPlc([
        {
          address: 'M0',
          value: false
        },
        {
          address: 'M1',
          value: false
        },
        {
          address: 'M37',
          value: false
        }
      ])
    }
  }

  useEffect(() => {
    const path = location.pathname
    let newMode: 'manual' | 'auto' | 'none'
    if (path === '/manual') {
      newMode = 'manual'
    } else if (path === '/auto-mode') {
      newMode = 'auto'
    } else {
      newMode = 'none'
    }

    setCurrentMode(newMode)
    hasModeBeenSentRef.current = false

    if (heartBeatStatus) {
      sendModeToPlc(newMode)
      hasModeBeenSentRef.current = true
    }
  }, [location.pathname])

  useEffect(() => {
    /**
     * Disconnect warning modal (debounced): only while logged in and PLC is
     * down, and only once the outage outlasts the grace window. A transient
     * blip (single Modbus timeout) reconnects before the timer fires, so the
     * modal never flashes. Reconnect / logout hides it immediately.
     */
    if (userDetails && !heartBeatStatus) {
      if (!disconnectModalTimerRef.current) {
        disconnectModalTimerRef.current = setTimeout(() => {
          disconnectModalTimerRef.current = null
          open()
        }, DISCONNECT_MODAL_GRACE_MS)
      }
    } else {
      if (disconnectModalTimerRef.current) {
        clearTimeout(disconnectModalTimerRef.current)
        disconnectModalTimerRef.current = null
      }
      close()
    }

    if (!heartBeatStatus) {
      hasModeBeenSentRef.current = false // reset when PLC disconnects
      return
    }

    // Only send if we have a mode and haven't sent it yet
    if (!hasModeBeenSentRef.current && currentMode !== 'none') {
      sendModeToPlc(currentMode)
      hasModeBeenSentRef.current = true
    }
  }, [heartBeatStatus, userDetails])

  // Clear the pending disconnect-modal timer on unmount.
  useEffect(() => {
    return () => {
      if (disconnectModalTimerRef.current) {
        clearTimeout(disconnectModalTimerRef.current)
        disconnectModalTimerRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    allItemsPlcRef.current = allItemsPlc
  }, [allItemsPlc])

  // PLC data push: full poll snapshot keyed by mapping strings ("M1000,100").
  useEffect(() => {
    const unsubscribe = api.plc.onData((data) => {
      if (!_.isEqual(allItemsPlcRef.current, data) && !_.isEmpty(data)) {
        setAllItemsPlc((data as PLCData) || {})
      }
    })
    return unsubscribe
  }, [])

  // PLC status push (1s heartbeat from main) + initial status fetch.
  useEffect(() => {
    const unsubscribe = api.plc.onStatus((status) => {
      setHeartBeatStatus(Boolean(status?.connected))
    })
    api.plc
      .getStatus()
      .then((status) => setHeartBeatStatus(Boolean(status?.connected)))
      .catch(() => setHeartBeatStatus(false))
    return unsubscribe
  }, [])

  const refreshUserDetails = (id: string) => {
    unwrap(api.adminUser.byId({ id }))
      .then((data) => {
        if (data) {
          setUserDetails(data as PortalUser)
          setSelectedModel((data as PortalUser).selectedModel || '')
        }
      })
      .catch((err) => console.error('Failed to refresh user details:', err))
  }

  /**
   * Single entry point for session changes: Login passes the user, logout
   * passes null. Keeps sessionStorage, context state and the main-process
   * session in sync (the mount effect below only covers a page reload).
   */
  const setSessionUser = (user: PortalUser | null) => {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user))
      setUserDetails(user)
      setSelectedModel(user.selectedModel || '')
      refreshUserDetails(user.id)
    } else {
      sessionStorage.removeItem('user')
      setUserDetails(undefined)
      setSelectedModel('')
      setSelectedModelDetails(null)
      api.auth.logout().catch((err) => console.error('Logout failed:', err))
    }
  }

  // Session user bootstrap on reload: re-hydrate from sessionStorage, refresh from DB.
  useEffect(() => {
    const stored = sessionStorage.getItem('user')
    const sessionUser: PortalUser | undefined = stored ? JSON.parse(stored) : undefined

    if (sessionUser?.id) {
      setUserDetails(sessionUser)
      setSelectedModel(sessionUser.selectedModel || '')
      refreshUserDetails(sessionUser.id)
    }
  }, [])

  const value: GlobalContextType = {
    readValueFromPlc,
    writeMultipleValuesToPlc,
    allItemsPlc,
    userDetails,
    setSessionUser,
    connectAllWs,
    plcManager,
    heartBeatStatus,
    currentMode,
    selectedModel,
    setSelectedModel,
    selectedModelDetails,
    setSelectedModelDetails
  }

  return (
    <GlobalContext.Provider value={value}>
      {children}
      <Modal
        opened={opened}
        onClose={close}
        withCloseButton={false}
        closeOnEscape={false}
        closeOnClickOutside={false}
      >
        <Flex direction={'column'} gap={'md'}>
          <Flex direction={'column'}>
            <Flex align={'center'} columnGap={'sm'}>
              <IconAlertHexagon color={'#FF6467'} />
              <HeadingLargeSemiBold color={'#FF6467'}>
                PLC Connection Interrupted
              </HeadingLargeSemiBold>
            </Flex>
            <BodyTextSemiBold color={'#E5E5E5'}>
              The system has lost connection with the PLC. Please wait for reconnection or exit the
              application.
            </BodyTextSemiBold>
          </Flex>
          <Flex direction={'column'} gap={'sm'}>
            <Button onClick={() => connectAllWs()}>Retry connection</Button>
            <Button variant="filled" bg="#fb2c36" onClick={() => api.app.exit()}>
              Exit
            </Button>
          </Flex>
        </Flex>
      </Modal>
    </GlobalContext.Provider>
  )
}

export function useGlobalContext() {
  const context = useContext(GlobalContext)
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalContextProvider')
  }
  return context
}
