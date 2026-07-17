import { ActionIcon, Flex, rem } from '@mantine/core'
import { IconArrowLeft, IconArrowRight } from '@tabler/icons-react'
import { useGlobalContext } from '../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { BodyTextSemiBold } from '../AllText/Text'

// Utility to convert octal PLC address to decimal
// Note: This will only work for X addresses
const convertOctalXValuesToDecimal = (addr: string): string => {
  const prefix = addr.charAt(0) // e.g., "X"
  const octalPart = addr.slice(1)
  const decimal = parseInt(octalPart, 8)
  if (isNaN(decimal)) {
    throw new Error(`Invalid PLC address: ${addr}`)
  }
  return `${prefix}${decimal}`
}
type ComponentProps = {
  label: string
  writeAddress: string

  reedFwdAddress: string
  reedRetAddress: string
}

const CylinderTestWOIndicator = ({
  label,
  writeAddress,
  reedFwdAddress,
  reedRetAddress
}: ComponentProps) => {
  const { writeMultipleValuesToPlc, readValueFromPlc } = useGlobalContext()

  const reedFwd = readValueFromPlc(convertOctalXValuesToDecimal(reedFwdAddress))
  const reedRet = readValueFromPlc(convertOctalXValuesToDecimal(reedRetAddress))

  return (
    <Flex w="100%" justify="space-between" pl={16} pr={16}>
      <Flex align="center" columnGap={12} pl={12}>
        <BodyTextSemiBold color="#F0E9F1">{label}</BodyTextSemiBold>
      </Flex>
      <Flex>
        <Flex columnGap={6}>
          <Flex direction="column" rowGap={4}>
            {/* Return Indicator */}
            <Flex
              w="100%"
              style={{
                height: rem(6),
                borderRadius: rem(20),
                background: reedRet ? '#F7945F' : '#D0D0D0'
              }}
            />
            <ActionIcon
              radius={4}
              w={52}
              h={40}
              variant="gradient"
              style={{ border: '1px solid #525252' }}
              gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
              onClick={() => {
                writeMultipleValuesToPlc([{ address: writeAddress, value: false }])
              }}
            >
              <IconArrowLeft color="#E5E5E5" />
            </ActionIcon>
          </Flex>
          <Flex direction="column" rowGap={4}>
            {/* Forward Indicator */}
            <Flex
              w="100%"
              style={{
                height: rem(6),
                borderRadius: rem(20),
                background: reedFwd ? '#F7945F' : '#D0D0D0'
              }}
            />
            <ActionIcon
              radius={4}
              w={52}
              h={40}
              variant="gradient"
              gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
              style={{ border: '1px solid #525252' }}
              onClick={() => {
                writeMultipleValuesToPlc([{ address: writeAddress, value: true }])
              }}
            >
              <IconArrowRight color="#E5E5E5" />
            </ActionIcon>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CylinderTestWOIndicator
