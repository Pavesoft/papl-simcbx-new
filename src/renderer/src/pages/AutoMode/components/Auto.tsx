import { Button, Divider, Flex, Modal } from '@mantine/core'
import { IconCircleCheckFilled, IconClipboardList, IconXboxXFilled } from '@tabler/icons-react'
import {
  CustomText,
  HeadingSmallMedium,
  HeadingMediumSemiBold
} from '../../../components/AllText/Text'
import { useGlobalContext } from '../../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { convert2WordstoFloat } from '../../../shared/util/general.util'
import { ERROR_CODES } from '../../../shared/Constants/general.const'
import { useDisclosure } from '@mantine/hooks'
import ErrorLogs from './ErrorLogs'
import { BarcodeScanResult } from './BarcodeScanResult'

function getErrorMessage(errorId: number): string {
  const error = ERROR_CODES.find((e) => e.id === errorId)
  return error?.message || 'Unknown Error'
}

const healthIndicatorColorMap: Record<number, string> = {
  0: '#262626', // Gray
  3: '#525252', // Slightly lighter gray
  2: '#FF000C', // Red
  1: '#00FFB0' // Green
}
const healthBackgroundColorMap: Record<number, string> = {
  0: '#262626', // Gray
  3: '#525252', // Slightly lighter gray
  2: '#330D0E', // Red
  1: '#1B362F' // Green
}

const Auto = () => {
  const { readValueFromPlc, writeMultipleValuesToPlc } = useGlobalContext()
  const [opened, { open, close }] = useDisclosure(false)
  const fetchSensorCylinderHealth = (bit: string) => {
    const value = readValueFromPlc(bit)
    return Number(value)
  }

  // This code converts number to float even if one word (either high or low) is 0 (to handle integers)
  const convertToFloat = (lowWordAddress: string, highWordAddress: string) => {
    const low = readValueFromPlc(lowWordAddress)
    const high = readValueFromPlc(highWordAddress)
    return convert2WordstoFloat(
      typeof low === 'number' ? low : 0,
      typeof high === 'number' ? high : 0
    )
  }

  return (
    <Flex w={1310} direction="column">
      {/* <Flex h={625} direction="column"> */}
      <Flex w={'100%'} pt={12} justify="space-between" align="center" h={56}>
        <Flex direction="column" pl={40}>
          <HeadingMediumSemiBold>STAGE 1</HeadingMediumSemiBold>
          <HeadingSmallMedium color="#D4D4D4">LOADING</HeadingSmallMedium>
        </Flex>
        <Flex columnGap={40}>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D200')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            {fetchSensorCylinderHealth('D200') === 1 ? (
              <IconCircleCheckFilled size={36} color="#00D492" />
            ) : (
              fetchSensorCylinderHealth('D200') === 2 && (
                <IconXboxXFilled size={36} color="#FB2C36" />
              )
            )}
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D240')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            {fetchSensorCylinderHealth('D240') === 1 ? (
              <IconCircleCheckFilled size={36} color="#00D492" />
            ) : (
              fetchSensorCylinderHealth('D240') === 2 && (
                <IconXboxXFilled size={36} color="#FB2C36" />
              )
            )}
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D280')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            {fetchSensorCylinderHealth('D280') === 1 ? (
              <IconCircleCheckFilled size={36} color="#00D492" />
            ) : (
              fetchSensorCylinderHealth('D280') === 2 && (
                <IconXboxXFilled size={36} color="#FB2C36" />
              )
            )}
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D320')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            {fetchSensorCylinderHealth('D320') === 1 ? (
              <IconCircleCheckFilled size={36} color="#00D492" />
            ) : (
              fetchSensorCylinderHealth('D320') === 2 && (
                <IconXboxXFilled size={36} color="#FB2C36" />
              )
            )}
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D360')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            {fetchSensorCylinderHealth('D360') === 1 ? (
              <IconCircleCheckFilled size={36} color="#00D492" />
            ) : (
              fetchSensorCylinderHealth('D360') === 2 && (
                <IconXboxXFilled size={36} color="#FB2C36" />
              )
            )}
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D400')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            {fetchSensorCylinderHealth('D400') === 1 ? (
              <IconCircleCheckFilled size={36} color="#00D492" />
            ) : (
              fetchSensorCylinderHealth('D400') === 2 && (
                <IconXboxXFilled size={36} color="#FB2C36" />
              )
            )}
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D440')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            {fetchSensorCylinderHealth('D440') === 1 ? (
              <IconCircleCheckFilled size={36} color="#00D492" />
            ) : (
              fetchSensorCylinderHealth('D440') === 2 && (
                <IconXboxXFilled size={36} color="#FB2C36" />
              )
            )}
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D480')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            {fetchSensorCylinderHealth('D480') === 1 ? (
              <IconCircleCheckFilled size={36} color="#00D492" />
            ) : (
              fetchSensorCylinderHealth('D480') === 2 && (
                <IconXboxXFilled size={36} color="#FB2C36" />
              )
            )}
          </Flex>
        </Flex>
      </Flex>
      <Divider c={'#404040'} my={9} />
      <Flex w={'100%'} justify="space-between" align="center" h={56}>
        <Flex direction="column" pl={40}>
          <HeadingMediumSemiBold>STAGE 2</HeadingMediumSemiBold>
          <HeadingSmallMedium color="#D4D4D4">RESISTANCE (mΩ)</HeadingSmallMedium>
        </Flex>
        <Flex columnGap={40}>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D242')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D242')]}
            >
              {convertToFloat('D243', 'D244')}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D282')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D282')]}
            >
              {convertToFloat('D283', 'D284')}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D322')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D322')]}
            >
              {convertToFloat('D323', 'D324')}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D362')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D362')]}
            >
              {convertToFloat('D363', 'D364')}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D402')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D402')]}
            >
              {convertToFloat('D403', 'D404')}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D442')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D442')]}
            >
              {convertToFloat('D443', 'D444')}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D482')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D482')]}
            >
              {convertToFloat('D483', 'D484')}
            </CustomText>
          </Flex>
        </Flex>
      </Flex>

      <Divider c={'#404040'} my={9} />
      <Flex w={'100%'} justify="space-between" align="center" h={56}>
        <Flex direction="column" pl={40}>
          <HeadingMediumSemiBold fontSize={40} fw="600">
            STAGE 3
          </HeadingMediumSemiBold>
          <HeadingSmallMedium color="#D4D4D4">IMPEDANCE (μF)</HeadingSmallMedium>
        </Flex>
        <Flex columnGap={40}>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D286')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D286')]}
            >
              {convertToFloat('D287', 'D288')}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D326')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D326')]}
            >
              {convertToFloat('D327', 'D328')}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D366')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D366')]}
            >
              {convertToFloat('D367', 'D368')}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D406')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D406')]}
            >
              {convertToFloat('D407', 'D408')}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D446')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D446')]}
            >
              {convertToFloat('D447', 'D448')}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D486')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D486')]}
            >
              {convertToFloat('D487', 'D488')}
            </CustomText>
          </Flex>
        </Flex>
      </Flex>
      <Divider c={'#404040'} my={9} />
      <Flex w={'100%'} justify="space-between" align="center" h={56}>
        <Flex direction="column" pl={40}>
          <HeadingMediumSemiBold>STAGE 4</HeadingMediumSemiBold>
          <HeadingSmallMedium color="#D4D4D4">CB1 LOAD (N)</HeadingSmallMedium>
        </Flex>
        <Flex columnGap={40}>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D330')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D330')]}
            >
              {Number(readValueFromPlc('D331')) / 100}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D370')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D370')]}
            >
              {Number(readValueFromPlc('D371')) / 100}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D410')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D410')]}
            >
              {Number(readValueFromPlc('D411')) / 100}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D450')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D450')]}
            >
              {Number(readValueFromPlc('D451')) / 100}
            </CustomText>
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D490')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <CustomText
              fontSize={32}
              fw="600"
              color={healthIndicatorColorMap[fetchSensorCylinderHealth('D490')]}
            >
              {Number(readValueFromPlc('D491')) / 100}
            </CustomText>
          </Flex>
        </Flex>
      </Flex>
      <Divider c={'#404040'} my={9} />
      <Flex w={'100%'} justify="space-between" align="center" h={112}>
        <Flex direction="column" pl={40} rowGap={14}>
          <Flex direction="column">
            <HeadingMediumSemiBold>STAGE 5</HeadingMediumSemiBold>
            <HeadingSmallMedium color="#D4D4D4">CB2 LOAD (N)</HeadingSmallMedium>
          </Flex>
          <HeadingSmallMedium color="#D4D4D4">BOP 1</HeadingSmallMedium>
        </Flex>
        <Flex direction="column" rowGap={14}>
          <Flex columnGap={40}>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D378')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              <CustomText
                fontSize={32}
                fw="600"
                color={healthIndicatorColorMap[fetchSensorCylinderHealth('D378')]}
              >
                {Number(readValueFromPlc('D380')) / 100}
              </CustomText>
            </Flex>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D418')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              <CustomText
                fontSize={32}
                fw="600"
                color={healthIndicatorColorMap[fetchSensorCylinderHealth('D418')]}
              >
                {Number(readValueFromPlc('D420')) / 100}
              </CustomText>
            </Flex>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D458')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              <CustomText
                fontSize={32}
                fw="600"
                color={healthIndicatorColorMap[fetchSensorCylinderHealth('D458')]}
              >
                {Number(readValueFromPlc('D460')) / 100}
              </CustomText>
            </Flex>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D498')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              <CustomText
                fontSize={32}
                fw="600"
                color={healthIndicatorColorMap[fetchSensorCylinderHealth('D498')]}
              >
                {Number(readValueFromPlc('D500')) / 100}
              </CustomText>
            </Flex>
          </Flex>
          <Flex columnGap={40}>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D379')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              {fetchSensorCylinderHealth('D379') === 1 ? (
                <IconCircleCheckFilled size={36} color="#00D492" />
              ) : (
                fetchSensorCylinderHealth('D379') === 2 && (
                  <IconXboxXFilled size={36} color="#FB2C36" />
                )
              )}
            </Flex>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D419')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              {fetchSensorCylinderHealth('D419') === 1 ? (
                <IconCircleCheckFilled size={36} color="#00D492" />
              ) : (
                fetchSensorCylinderHealth('D419') === 2 && (
                  <IconXboxXFilled size={36} color="#FB2C36" />
                )
              )}
            </Flex>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D459')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              {fetchSensorCylinderHealth('D459') === 1 ? (
                <IconCircleCheckFilled size={36} color="#00D492" />
              ) : (
                fetchSensorCylinderHealth('D459') === 2 && (
                  <IconXboxXFilled size={36} color="#FB2C36" />
                )
              )}
            </Flex>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D499')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              {fetchSensorCylinderHealth('D499') === 1 ? (
                <IconCircleCheckFilled size={36} color="#00D492" />
              ) : (
                fetchSensorCylinderHealth('D499') === 2 && (
                  <IconXboxXFilled size={36} color="#FB2C36" />
                )
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Divider c={'#404040'} my={9} />
      <Flex w={'100%'} justify="space-between" align="center" h={112}>
        <Flex direction="column" pl={40} rowGap={14}>
          <Flex direction="column">
            <HeadingMediumSemiBold>STAGE 6</HeadingMediumSemiBold>
            <HeadingSmallMedium color="#D4D4D4">BEARING</HeadingSmallMedium>
          </Flex>
          <HeadingSmallMedium color="#D4D4D4">BOP 2</HeadingSmallMedium>
        </Flex>
        <Flex direction="column" rowGap={14}>
          <Flex columnGap={40}>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D429')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              {fetchSensorCylinderHealth('D429') === 1 ? (
                <IconCircleCheckFilled size={36} color="#00D492" />
              ) : (
                fetchSensorCylinderHealth('D429') === 2 && (
                  <IconXboxXFilled size={36} color="#FB2C36" />
                )
              )}
            </Flex>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D469')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              {fetchSensorCylinderHealth('D469') === 1 ? (
                <IconCircleCheckFilled size={36} color="#00D492" />
              ) : (
                fetchSensorCylinderHealth('D469') === 2 && (
                  <IconXboxXFilled size={36} color="#FB2C36" />
                )
              )}
            </Flex>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D509')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              {fetchSensorCylinderHealth('D509') === 1 ? (
                <IconCircleCheckFilled size={36} color="#00D492" />
              ) : (
                fetchSensorCylinderHealth('D509') === 2 && (
                  <IconXboxXFilled size={36} color="#FB2C36" />
                )
              )}
            </Flex>
          </Flex>
          <Flex columnGap={40}>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D428')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              {fetchSensorCylinderHealth('D428') === 1 ? (
                <IconCircleCheckFilled size={36} color="#00D492" />
              ) : (
                fetchSensorCylinderHealth('D428') === 2 && (
                  <IconXboxXFilled size={36} color="#FB2C36" />
                )
              )}
            </Flex>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D468')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              {fetchSensorCylinderHealth('D468') === 1 ? (
                <IconCircleCheckFilled size={36} color="#00D492" />
              ) : (
                fetchSensorCylinderHealth('D468') === 2 && (
                  <IconXboxXFilled size={36} color="#FB2C36" />
                )
              )}
            </Flex>
            <Flex
              w={98}
              h={48}
              bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D508')]}
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              {fetchSensorCylinderHealth('D508') === 1 ? (
                <IconCircleCheckFilled size={36} color="#00D492" />
              ) : (
                fetchSensorCylinderHealth('D508') === 2 && (
                  <IconXboxXFilled size={36} color="#FB2C36" />
                )
              )}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Divider c={'#404040'} my={9} />
      <Flex w={'100%'} justify="space-between" align="center" h={56}>
        <Flex direction="column" pl={40}>
          <HeadingMediumSemiBold>STAGE 7</HeadingMediumSemiBold>
          <HeadingSmallMedium color="#D4D4D4">MARKING</HeadingSmallMedium>
        </Flex>
        <Flex columnGap={40}>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D470')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            {fetchSensorCylinderHealth('D470') === 1 ? (
              <IconCircleCheckFilled size={36} color="#00D492" />
            ) : (
              fetchSensorCylinderHealth('D470') === 2 && (
                <IconXboxXFilled size={36} color="#FB2C36" />
              )
            )}
          </Flex>
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D510')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            {fetchSensorCylinderHealth('D510') === 1 ? (
              <IconCircleCheckFilled size={36} color="#00D492" />
            ) : (
              fetchSensorCylinderHealth('D510') === 2 && (
                <IconXboxXFilled size={36} color="#FB2C36" />
              )
            )}
          </Flex>
        </Flex>
      </Flex>
      <Divider c={'#404040'} my={9} />
      <Flex w={'100%'} justify="space-between" align="center" h={56}>
        <Flex direction="column" pl={40}>
          <HeadingMediumSemiBold>STAGE 8</HeadingMediumSemiBold>
          <HeadingSmallMedium color="#D4D4D4">SCANNING / UNLOADING</HeadingSmallMedium>
        </Flex>
        <Flex columnGap={40}>
          <BarcodeScanResult />
          <Flex
            w={98}
            h={48}
            bg={healthBackgroundColorMap[fetchSensorCylinderHealth('D519')]}
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            {fetchSensorCylinderHealth('D519') === 1 ? (
              <IconCircleCheckFilled size={36} color="#00D492" />
            ) : (
              fetchSensorCylinderHealth('D519') === 2 && (
                <IconXboxXFilled size={36} color="#FB2C36" />
              )
            )}
          </Flex>
        </Flex>
      </Flex>
      <Divider c={'#404040'} my={21} />
      <Flex columnGap={20}>
        <Flex columnGap={20} ml={40}>
          <HeadingSmallMedium>ERROR STATUS :</HeadingSmallMedium>
          <Flex w={740} h={36} bg="#262626" pl={8} align="center" style={{ borderRadius: '4px' }}>
            <HeadingMediumSemiBold color={readValueFromPlc('D662') === 0 ? '#00BC7D' : '#FB2C36'}>
              {getErrorMessage(readValueFromPlc('D662') as number)}
            </HeadingMediumSemiBold>
          </Flex>
        </Flex>
        <Flex columnGap={16}>
          <Button
            variant="gradient"
            gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
            style={{ border: '1px solid #525252' }}
            onClick={() => {
              if (readValueFromPlc('M1910')) {
                writeMultipleValuesToPlc([{ address: 'M1910', value: false }])
              } else {
                writeMultipleValuesToPlc([{ address: 'M1910', value: true }])
              }
            }}
            size="md"
          >
            {/* BUZZER OFF */}
            {readValueFromPlc('M1910') ? 'BUZZER MUTE' : 'BUZZER ON'}
          </Button>
          <Button
            variant="gradient"
            gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
            style={{ border: '1px solid #525252' }}
            leftSection={<IconClipboardList />}
            onClick={() => open()}
            size="md"
          >
            ERROR LOGS
          </Button>
        </Flex>
      </Flex>
      {/* </Flex> */}
      <Modal opened={opened} onClose={close} title="ERROR LOGS" size="xl">
        <ErrorLogs />
      </Modal>
    </Flex>
  )
}

export default Auto
