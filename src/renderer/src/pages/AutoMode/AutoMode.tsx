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
    const laserBit = readValueFromPlc(TRIGGER_LASER_MARKER_BIT)
    const barcodeBit = readValueFromPlc(TRIGGER_BARCODE_SCANNER_BIT)
    const dumpBit = readValueFromPlc(TRIGGER_DUMP_PART_DATA_BIT)

    const shouldTriggerLaser = laserBit && !plcTriggerBitsPrevValue.current.laserMarkingTriggerBit
    const shouldTriggerBarcode =
      barcodeBit && !plcTriggerBitsPrevValue.current.barcodeScanningTriggerBit
    const shouldDumpPartData = dumpBit && !plcTriggerBitsPrevValue.current.dumpPartDataTriggerBit

    const isModelReady = !!(
      selectedModel &&
      selectedModelDetails &&
      selectedModelDetails.id &&
      selectedModelDetails.partNo
    )

    /**
     * Track whether each rising edge was actually serviced this cycle.
     * If a trigger fires but we can't service it yet - the model details are
     * still loading, or a previous run of the same operation is still in
     * progress - we must NOT advance the previous-value latch below. Otherwise
     * the low->high edge gets consumed and, since the PLC holds the bit high,
     * no new rising edge is ever seen and the operation never runs for that part.
     */
    let laserServiced = true
    let barcodeServiced = true
    let dumpServiced = true

    if (shouldTriggerLaser) {
      if (!isModelReady) {
        laserServiced = false
        console.warn("model or model details missing therefore can't trigger laser marker")
      } else if (laserInProgress.current) {
        // previous marking still running - leave the edge pending so it retries
        laserServiced = false
      } else {
        laserInProgress.current = true
        ;(async () => {
          let marked = false
          try {
            const markContent = await generatePartSerialNumber({
              modelId: selectedModelDetails!.id,
              modelPartNo: selectedModelDetails!.partNo,
              revNo: selectedModelDetails!.revNo
            })
            marked = await triggerLaserMarker(
              writeMultipleValuesToPlc,
              selectedModelDetails!.fileName ?? '',
              'Barcode',
              markContent
            )
            // Only persist/advance the serial number when the laser actually
            // marked the part. Otherwise a not-ready or failed mark would burn
            // a serial number that never got printed.
            if (marked && selectedModel) {
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
            // If the part was NOT actually marked (laser reported not-ready,
            // the mark failed, or something threw) the trigger bit is still
            // high on the PLC. Release the edge latch so the next poll sees a
            // fresh rising edge and retries this part, instead of consuming the
            // trigger and skipping it - the cause of rare (~1-in-100) misses.
            if (!marked) {
              console.log(
                '⚠️ Laser marking did NOT happen for this part - releasing the trigger edge to retry on the next poll'
              )
              plcTriggerBitsPrevValue.current.laserMarkingTriggerBit = false
            }
          }
        })()
      }
    }

    if (shouldTriggerBarcode) {
      if (!isModelReady) {
        barcodeServiced = false
        console.warn("model or model details missing therefore can't trigger barcode scanner")
      } else if (scannerInProgress.current) {
        barcodeServiced = false
      } else {
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
    }

    if (shouldDumpPartData) {
      if (!isModelReady) {
        dumpServiced = false
        console.warn("model or model details missing therefore can't dump part data")
      } else if (dumpPartDataInProgress.current) {
        dumpServiced = false
      } else {
        dumpPartDataInProgress.current = true
        ;(async () => {
          try {
            const laserMarkContent = readLaserMarkContent(readValueFromPlc)
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
    }

    /**
     * Advance the previous-value latch. For a rising edge we could not service,
     * keep the previous value untouched (it stays low) so the edge is detected
     * again on the next cycle once the operation is free / the model is ready.
     */
    if (!(shouldTriggerLaser && !laserServiced)) {
      plcTriggerBitsPrevValue.current.laserMarkingTriggerBit = laserBit
    }
    if (!(shouldTriggerBarcode && !barcodeServiced)) {
      plcTriggerBitsPrevValue.current.barcodeScanningTriggerBit = barcodeBit
    }
    if (!(shouldDumpPartData && !dumpServiced)) {
      plcTriggerBitsPrevValue.current.dumpPartDataTriggerBit = dumpBit
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
        <Flex h="88">
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
