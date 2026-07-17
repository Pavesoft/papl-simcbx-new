import { Divider, Flex } from '@mantine/core'
import { INPUT_1, INPUT_2, INPUT_3, INPUT_4 } from './Input.const'
import React from 'react'
import { useGlobalContext } from '../../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { BodyTextMedium, HeadingMediumSemiBold } from '../../../components/AllText/Text'

/**
 * Converts a Mitsubishi PLC bit address (e.g., "X10", "Y20") from octal to decimal.
 * Returns the string like "X8" or "Y14".
 * Example: "X10" => "X8"
 * This is done because, in the plc.const file, X0,107, corresponds to 107 octal items from X0.
 * But if we want to switch on X10, we will actually have to pass the decimal address i.e X8 to the writeMultipleValuesToPlc
 function
 * This is the way it has been mapped in the mcprotocol library.
 */
function getConvertedPlcAddress(addr: string): string {
  const prefix = addr.charAt(0) // "X" or "Y"
  const octalPart = addr.slice(1)
  const decimal = parseInt(octalPart, 8)
  if (isNaN(decimal)) {
    throw new Error(`Invalid PLC address: ${addr}`)
  }
  return `${prefix}${decimal}`
}

const renderInputBlock = (
  inputList: { addr: string; input: string }[],
  readValueFromPlc: (addr: string) => boolean
) => {
  return (
    <Flex direction="column">
      <Flex bg="#262626" w={'100%'} style={{ borderRadius: '8px 8px 0px 0px' }}>
        <HeadingMediumSemiBold color="#F0E9F1" pl={12} pt={4} pb={4}>
          I/P ADDR
        </HeadingMediumSemiBold>
        <HeadingMediumSemiBold color="#F0E9F1" pl={16} pt={4} pb={4}>
          Inputs
        </HeadingMediumSemiBold>
      </Flex>
      <Flex
        style={{ borderRadius: '0px 0px 8px 8px ' }}
        bg="#171717"
        w={'100%'}
        direction="column"
        rowGap={16}
        pt={16}
        pb={16}
        pl={12}
        pr={12}
      >
        {inputList.map((item, index) => {
          const convertedAddr = getConvertedPlcAddress(item.addr) // e.g., "X10" -> "X8"
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
                <BodyTextMedium color="#FAFAFA">{item.input}</BodyTextMedium>
              </Flex>
              {index === 8 && <Divider />}
            </React.Fragment>
          )
        })}
      </Flex>
    </Flex>
  )
}
const Input = () => {
  const { readValueFromPlc } = useGlobalContext()

  // Ensure the function always returns a boolean
  const safeReadValueFromPlc = (addr: string) => !!readValueFromPlc(addr)

  return (
    <Flex bg="#0a0a0a" p={24} columnGap={20}>
      <Flex w={'25%'} direction="column" rowGap={20}>
        {renderInputBlock(INPUT_1, safeReadValueFromPlc)}
      </Flex>
      <Flex w={'25%'} direction="column" rowGap={20}>
        {renderInputBlock(INPUT_2, safeReadValueFromPlc)}
      </Flex>
      <Flex w={'25%'} direction="column" rowGap={20}>
        {renderInputBlock(INPUT_3, safeReadValueFromPlc)}
      </Flex>
      <Flex w={'25%'} direction="column" rowGap={20}>
        {renderInputBlock(INPUT_4, safeReadValueFromPlc)}
      </Flex>
    </Flex>
  )
}

export default Input
