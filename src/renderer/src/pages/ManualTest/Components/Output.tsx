import { Divider, Flex } from '@mantine/core'
import { OUTPUT_1, OUTPUT_2, OUTPUT_3, OUTPUT_4 } from './Output.const'
import React from 'react'
import { useGlobalContext } from '../../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { BodyTextMedium, HeadingMediumSemiBold } from '../../../components/AllText/Text'

/**
 * Converts an octal-based Mitsubishi PLC address to decimal (e.g., Y10 => Y8)
 */
function getConvertedPlcAddress(addr: string): string {
  const prefix = addr.charAt(0) // e.g., 'Y'
  const octalPart = addr.slice(1)
  const decimal = parseInt(octalPart, 8)

  if (isNaN(decimal)) {
    throw new Error(`Invalid PLC address: ${addr}`)
  }

  return `${prefix}${decimal}`
}

const renderOutputBlock = (
  outputList: { addr: string; output: string }[],
  readValueFromPlc: (addr: string) => boolean
) => {
  return (
    <Flex direction="column">
      <Flex bg="#262626" w={'100%'} style={{ borderRadius: '8px 8px 0px 0px' }}>
        <HeadingMediumSemiBold color="#F0E9F1" pl={12} pt={4} pb={4}>
          O/P ADDR
        </HeadingMediumSemiBold>
        <HeadingMediumSemiBold color="#F0E9F1" pl={16} pt={4} pb={4}>
          Outputs
        </HeadingMediumSemiBold>
      </Flex>
      <Flex
        style={{ borderRadius: '0px 0px 8px 8px' }}
        bg="#171717"
        w={'100%'}
        direction="column"
        rowGap={16}
        pt={16}
        pb={16}
        pl={12}
        pr={12}
      >
        {outputList.map((item, index) => {
          const convertedAddr = getConvertedPlcAddress(item.addr)
          const isOn = readValueFromPlc(convertedAddr)

          return (
            <React.Fragment key={index}>
              <Flex columnGap={12} align="center">
                <Flex
                  w={88}
                  h={31}
                  bg={isOn ? '#00BC7D' : '#262626'}
                  justify="center"
                  align="center"
                  style={{ borderRadius: '4px' }}
                >
                  <HeadingMediumSemiBold color={isOn ? '#1B362F' : '#737373'}>
                    {item.addr}
                  </HeadingMediumSemiBold>
                </Flex>
                <BodyTextMedium color="#FAFAFA">{item.output}</BodyTextMedium>
              </Flex>
              {index === 8 && <Divider />}
            </React.Fragment>
          )
        })}
      </Flex>
    </Flex>
  )
}
const Output = () => {
  const { readValueFromPlc } = useGlobalContext()

  const safeReadValueFromPlc = (addr: string) => !!readValueFromPlc(addr)

  return (
    <Flex bg="#0a0a0a" p={24} columnGap={20}>
      <Flex w={'25%'} direction="column" rowGap={20}>
        {renderOutputBlock(OUTPUT_1, safeReadValueFromPlc)}
      </Flex>
      <Flex w={'25%'} direction="column" rowGap={20}>
        {renderOutputBlock(OUTPUT_2, safeReadValueFromPlc)}
      </Flex>
      <Flex w={'27%'} direction="column" rowGap={20}>
        {renderOutputBlock(OUTPUT_3, safeReadValueFromPlc)}
      </Flex>
      <Flex w={'23%'} direction="column" rowGap={20}>
        {renderOutputBlock(OUTPUT_4, safeReadValueFromPlc)}
      </Flex>
    </Flex>
  )
}

export default Output
