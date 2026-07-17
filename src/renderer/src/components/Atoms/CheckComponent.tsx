import { ActionIcon, Flex, Indicator, Text } from '@mantine/core'
import resistanceActiveIcon from '../../assets/svg/resistance.svg'
import { useGlobalContext } from '../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { convert2WordstoFloat } from '../../shared/util/general.util'
import { HeadingMediumSemiBold } from '../AllText/Text'

type ComponentProps = {
  label: string
  writeAddress?: string
  opHealthAddress?: string
  lowWordAddress?: string
  highWordAddress?: string
  unit: string
}

const CheckComponent = ({
  label,
  opHealthAddress,
  writeAddress,
  lowWordAddress,
  highWordAddress,
  unit
}: ComponentProps) => {
  const { writeMultipleValuesToPlc, readValueFromPlc } = useGlobalContext()

  // Compute resistance value once before render
  const resistanceValue =
    lowWordAddress && highWordAddress
      ? convert2WordstoFloat(
          typeof readValueFromPlc(lowWordAddress) === 'number'
            ? (readValueFromPlc(lowWordAddress) as number)
            : 0,
          typeof readValueFromPlc(highWordAddress) === 'number'
            ? (readValueFromPlc(highWordAddress) as number)
            : 0
        )
      : 0

  return (
    <Flex w="100%" justify="space-between" pl={16} pr={16}>
      <Flex align="center" columnGap={12}>
        <Indicator
          color={opHealthAddress && readValueFromPlc(opHealthAddress) ? 'green' : 'red'}
          size={12}
          processing
        />
        <HeadingMediumSemiBold color="#F0E9F1">{label}</HeadingMediumSemiBold>
      </Flex>

      <Flex>
        <Flex columnGap={6}>
          <ActionIcon
            radius={4}
            w={44}
            h={36}
            className="jog-button"
            style={{ border: '1px solid #525252' }}
            onMouseDown={() => {
              if (writeAddress) writeMultipleValuesToPlc([{ address: writeAddress, value: true }])
            }}
            onMouseUp={() => {
              if (writeAddress) writeMultipleValuesToPlc([{ address: writeAddress, value: false }])
            }}
          >
            <img
              className="return-action-icon"
              src={resistanceActiveIcon}
              alt="Resistance"
              width={24}
              height={24}
            />
          </ActionIcon>

          <Flex direction="column">
            <Flex
              w={110}
              h={36}
              bg="#262626"
              justify="center"
              align="center"
              style={{ borderRadius: '4px' }}
            >
              <Text size="26px" c="#737373" fw={600}>
                {resistanceValue}
              </Text>
            </Flex>
            <Text size="lg" c="#A1A1A1">
              {unit}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CheckComponent
