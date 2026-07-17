import { Flex, Text } from '@mantine/core'
import { useGlobalContext } from '../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { convert2WordsToInt } from '../../shared/util/general.util'
import { HeadingMediumSemiBold } from '../AllText/Text'

type ComponentProps = {
  label: string
  unit: string
  word: 'one' | 'two'
  wordAddress?: string | undefined
  positionLowWordAddress?: string | undefined
  positionHighWordAddress?: string | undefined
}
const ActualPosition = ({
  label,
  unit,
  positionLowWordAddress,
  positionHighWordAddress,
  word,
  wordAddress
}: ComponentProps) => {
  const { readValueFromPlc } = useGlobalContext()

  // Compute the actual position value before the return
  const position =
    word === 'one'
      ? wordAddress
        ? Number(readValueFromPlc(wordAddress)) / (label === 'ACTUAL LOAD' ? 100 : 1000)
        : 0
      : positionLowWordAddress && positionHighWordAddress
        ? convert2WordsToInt(
            typeof readValueFromPlc(positionLowWordAddress) === 'number'
              ? (readValueFromPlc(positionLowWordAddress) as number)
              : 0,
            typeof readValueFromPlc(positionHighWordAddress) === 'number'
              ? (readValueFromPlc(positionHighWordAddress) as number)
              : 0
          ) / (label === 'ACTUAL LOAD' ? 100 : 1000)
        : 0
  return (
    <Flex direction="column" pl={16} pr={16}>
      <Flex w="100%" justify="space-between">
        <HeadingMediumSemiBold color="#F0E9F1">{label}</HeadingMediumSemiBold>

        <Flex>
          <Flex columnGap={6}>
            <Flex direction="column">
              <Flex
                w={94}
                h={36}
                bg="#262626"
                justify="center"
                align="center"
                style={{ borderRadius: '4px' }}
              >
                <HeadingMediumSemiBold color="#737373">{position}</HeadingMediumSemiBold>
              </Flex>
              <Text c="#A1A1A1">{unit}</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ActualPosition
