import { Box, Button, Divider, Flex } from '@mantine/core'
import { useEffect, useRef, useState } from 'react'
import { api, unwrap } from '../../api'
import type { ModelSetting } from '@prisma/client'
import { HeadingMediumSemiBold, HeadingSmallMedium } from '../../components/AllText/Text'
import SensorCylinderHealth from './components/SensorCylinderHealth'
import StageStatus from './components/StageStatus'
import Auto from './components/Auto'
import PartConfiguration from './components/PartConfiguration'
import BottomStatus from './components/BottomStatus'
import { useGlobalContext } from '../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { STATUS_CODE_MAP } from '../../shared/Constants/general.const'
import { dumpPartData } from './dumpPartData'
import { triggerLaserMarker } from './triggerLaserMarker'
import { triggerScanner } from './triggerScanner'
import DisplacementGraph from './components/DisplacementGraph'
import { generatePartSerialNumber } from './generatePartSerialNumber'
import { readLaserMarkContent } from './utils'
import {
  TRIGGER_BARCODE_SCANNER_BIT,
  TRIGGER_LASER_MARKER_BIT,
  TRIGGER_DUMP_PART_DATA_BIT
} from '@shared/plc.const'
import { ModelSelect } from '../../components/ModelSelect'
import { AutoContextProvider } from './context'

interface IPlcTriggerBitsPrevValue {
  laserMarkingTriggerBit: number | boolean | null
  barcodeScanningTriggerBit: number | boolean | null
  dumpPartDataTriggerBit: number | boolean | null
}

const AutoMode = () => {
  const {
    writeMultipleValuesToPlc,
    readValueFromPlc,
    allItemsPlc,
    selectedModelDetails,
    selectedModel
  } = useGlobalContext()

  const [isCollapsed, setIsCollapsed] = useState(true)
  const [barcodeScanResult, setBarcodeScanResult] = useState<string | null>(null)
  const dumpPartDataInProgress = useRef(false)
  const laserInProgress = useRef(false)
  const scannerInProgress = useRef(false)
  const plcTriggerBitsPrevValue = useRef<IPlcTriggerBitsPrevValue>({
    laserMarkingTriggerBit: false,
    barcodeScanningTriggerBit: false,
    dumpPartDataTriggerBit: false
  })

  useEffect(() => {
    /**
     * this logic checks if the bit are going from low to high by comparing current and previous value
     * we only want to trigger operations when the bits switch from low to high and not if they're constantly high
     */

    /**
     * in a cycle two or more operations ( i.e., laser marking, scanning, data logging, etc ) can be performed simutaneously on separate parts
     */
    const shouldTriggerLaser =
      readValueFromPlc(TRIGGER_LASER_MARKER_BIT) &&
      !plcTriggerBitsPrevValue.current.laserMarkingTriggerBit
    const shouldTriggerBarcode =
      readValueFromPlc(TRIGGER_BARCODE_SCANNER_BIT) &&
      !plcTriggerBitsPrevValue.current.barcodeScanningTriggerBit
    const shouldDumpPartData =
      readValueFromPlc(TRIGGER_DUMP_PART_DATA_BIT) &&
      !plcTriggerBitsPrevValue.current.dumpPartDataTriggerBit

    //update previous values for all trigger bits
    plcTriggerBitsPrevValue.current.laserMarkingTriggerBit =
      readValueFromPlc(TRIGGER_LASER_MARKER_BIT)
    plcTriggerBitsPrevValue.current.barcodeScanningTriggerBit = readValueFromPlc(
      TRIGGER_BARCODE_SCANNER_BIT
    )
    plcTriggerBitsPrevValue.current.dumpPartDataTriggerBit = readValueFromPlc(
      TRIGGER_DUMP_PART_DATA_BIT
    )

    if (
      (shouldDumpPartData || shouldTriggerBarcode || shouldTriggerLaser) &&
      (!selectedModel ||
        !selectedModelDetails ||
        !selectedModelDetails?.id ||
        !selectedModelDetails.partNo)
    ) {
      console.warn(
        "model or model details missing therefore can't process with laser, barcode or dump part data operation"
      )
      return
    }

    if (shouldTriggerLaser && !laserInProgress.current && selectedModelDetails) {
      laserInProgress.current = true
      ;(async () => {
        try {
          const markContent = await generatePartSerialNumber({
            modelId: selectedModelDetails.id,
            modelPartNo: selectedModelDetails.partNo,
            revNo: selectedModelDetails.revNo
          })
          await triggerLaserMarker(
            writeMultipleValuesToPlc,
            selectedModelDetails.fileName ?? '',
            'Barcode',
            markContent
          )
          if (selectedModel) {
            await unwrap(
              api.modelSerialNumber.update({
                modelId: selectedModel,
                serialNumber: markContent,
                date: new Date()
              })
            )
          }
        } catch (error) {
          console.error('Failed to trigger laser marker', error)
        } finally {
          // Make sure this flag is reset
          // It makes sure the same logic doesn't end up running redundantly
          laserInProgress.current = false
        }
      })()
    }
    if (shouldTriggerBarcode && !scannerInProgress.current) {
      scannerInProgress.current = true
      ;(async () => {
        try {
          const scannerResponse = await triggerScanner(readValueFromPlc, writeMultipleValuesToPlc)
          if (scannerResponse?.barcode) {
            setBarcodeScanResult(scannerResponse.barcode)
          } else {
            setBarcodeScanResult(null)
          }
        } catch (e) {
          console.error('Failed to trigger barcode scanner', e)
        } finally {
          scannerInProgress.current = false
        }
      })()
    }
    if (shouldDumpPartData && !dumpPartDataInProgress.current) {
      ;(async () => {
        try {
          const laserMarkContent = readLaserMarkContent(readValueFromPlc)
          if (!selectedModel) {
            throw new Error('model is missing')
          }
          await dumpPartData(
            readValueFromPlc,
            writeMultipleValuesToPlc,
            laserMarkContent,
            selectedModelDetails as ModelSetting
          )
        } catch (e) {
          console.error('Failed to dump part data', e)
        } finally {
          dumpPartDataInProgress.current = false
        }
      })()
    }
  }, [allItemsPlc])

  return (
    <Box pos="relative">
      <Flex w="100%" bg={'#0a0a0a'} p={16} direction="column">
        <Flex h="127" justify="space-between" w={'100%'} align={'center'}>
          <Flex direction="column" rowGap={8}>
            <Flex align="flex-end" columnGap={24}>
              <ModelSelect />

              <Button
                variant="filled"
                color={readValueFromPlc('M1909') ? '#1b362f' : '#F27B48'}
                disabled={readValueFromPlc('M1909') as boolean}
                onClick={() => writeMultipleValuesToPlc([{ address: 'M1909', value: true }])}
                size="md"
              >
                PRODUCTION END
              </Button>
            </Flex>

            <HeadingSmallMedium>PROGRAM NO. : {selectedModelDetails?.programNo}</HeadingSmallMedium>
          </Flex>
          <StageStatus />
        </Flex>
        <Divider color="#404040" />
        <Flex h="781">
          <Flex w={610} pr={24} pt={24} direction="column" rowGap={20}>
            <DisplacementGraph isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <PartConfiguration {...(selectedModelDetails as ModelSetting)} />
            <SensorCylinderHealth isCollapsed={isCollapsed} />
          </Flex>
          <Divider orientation="vertical" color="#404040" />
          <AutoContextProvider barcodeScanResult={barcodeScanResult}>
            <Auto />
          </AutoContextProvider>
        </Flex>
        <Divider c={'#404040'} />
        <Flex h="100">
          <Flex w={798}>
            <BottomStatus />
            <Divider c={'#404040'} orientation="vertical" ml={17} mr={17} />
            <Flex align="flex-end">
              <Flex direction="column">
                <HeadingSmallMedium>SEQUENCE STATUS</HeadingSmallMedium>
                <Flex
                  w={670}
                  h={36}
                  bg="#262626"
                  pl={8}
                  align="center"
                  style={{ borderRadius: '4px' }}
                >
                  <HeadingMediumSemiBold color="#737373">
                    {STATUS_CODE_MAP[readValueFromPlc('D661') as number]}
                  </HeadingMediumSemiBold>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}

export default AutoMode
