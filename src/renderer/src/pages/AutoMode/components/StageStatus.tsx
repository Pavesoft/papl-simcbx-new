import { Flex, Text } from '@mantine/core'
import { HeadingSmallMedium, HeadingMediumSemiBold } from '../../../components/AllText/Text'
import { useGlobalContext } from '../../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { IconCircleCheckFilled, IconXboxXFilled } from '@tabler/icons-react'

const statusItems = [
  { label: 'STAGE 1', address: 'D1' },
  { label: 'STAGE 2', address: 'D2' },
  { label: 'STAGE 3', address: 'D3' },
  { label: 'STAGE 4', address: 'D4' },
  { label: 'STAGE 5', address: 'D5' },
  { label: 'STAGE 6', address: 'D6' },
  { label: 'STAGE 7', address: 'D7' },
  { label: 'STAGE 8', address: 'D8' }
]

const boxStyle = {
  width: 82,
  height: 36,
  // backgroundColor: "#262626",
  borderRadius: '4px'
}

const StageStatus = () => {
  const { readValueFromPlc } = useGlobalContext()
  return (
    <Flex columnGap={41}>
      <Flex columnGap={16}>
        <Flex direction="column">
          <HeadingSmallMedium>INDEXING</HeadingSmallMedium>
          <Flex
            style={boxStyle}
            justify="center"
            align="center"
            bg={
              readValueFromPlc('D9') !== null
                ? readValueFromPlc('D9') === 0
                  ? '#1B362F'
                  : '#330D0E'
                : '#262626'
            }
          >
            {readValueFromPlc('D9') !== null ? (
              readValueFromPlc('D9') === 0 ? (
                <IconCircleCheckFilled size={30} color="#00D492" />
              ) : (
                <IconXboxXFilled size={30} color="#FB2C36" />
              )
            ) : null}
          </Flex>
        </Flex>
        <Flex direction="column">
          <HeadingSmallMedium>TOTAL CYL TIME</HeadingSmallMedium>
          <Flex
            w={112}
            h={36}
            bg="#262626"
            justify="center"
            align="center"
            style={{ borderRadius: '4px' }}
          >
            <HeadingMediumSemiBold color="#00BC7D">
              {typeof readValueFromPlc('D660') === 'number'
                ? readValueFromPlc('D660') !== null
                  ? (readValueFromPlc('D660') as number) / 10
                  : 0
                : null}
            </HeadingMediumSemiBold>
          </Flex>
          <Text size="xl">SEC</Text>
        </Flex>
      </Flex>
      <Flex columnGap={56}>
        {statusItems.map(({ label, address }) => (
          <Flex key={address} direction="column">
            <HeadingSmallMedium>{label}</HeadingSmallMedium>
            <Flex
              style={boxStyle}
              justify="center"
              align="center"
              bg={
                readValueFromPlc(address) !== null
                  ? readValueFromPlc(address) === 0
                    ? '#1B362F'
                    : '#330D0E'
                  : '#262626'
              }
            >
              {readValueFromPlc(address) !== null ? (
                readValueFromPlc(address) === 0 ? (
                  <IconCircleCheckFilled size={30} color="#00D492" />
                ) : (
                  <IconXboxXFilled size={30} color="#FB2C36" />
                )
              ) : null}
            </Flex>
          </Flex>
        ))}
      </Flex>
    </Flex>
  )
}

export default StageStatus
