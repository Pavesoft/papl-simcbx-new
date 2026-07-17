import { Button, Flex, Indicator } from '@mantine/core'
import { useGlobalContext } from '../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { HeadingMediumSemiBold } from '../AllText/Text'

type ComponentProps = {
  label: string
  buttonLabel: string
  writeAddress: string
  opHealthAddress: string
}

const StatusSingleButtonComponent = ({
  label,
  buttonLabel,
  writeAddress,
  opHealthAddress
}: ComponentProps) => {
  const { writeMultipleValuesToPlc, readValueFromPlc } = useGlobalContext()

  return (
    <Flex w="100%" justify="space-between" pl={16} pr={16}>
      <Flex align="center" columnGap={12}>
        <Indicator
          color={readValueFromPlc(opHealthAddress) ? 'green' : 'red'}
          size={12}
          processing
        />
        <HeadingMediumSemiBold color="#F0E9F1">{label}</HeadingMediumSemiBold>
      </Flex>
      <Flex>
        <Button
          w={94}
          className="jog-button"
          style={{ border: '1px solid #525252' }}
          onMouseDown={() => {
            writeMultipleValuesToPlc([{ address: writeAddress, value: true }])
          }}
          onMouseUp={() => {
            writeMultipleValuesToPlc([{ address: writeAddress, value: false }])
          }}
        >
          {buttonLabel}
        </Button>
      </Flex>
    </Flex>
  )
}

export default StatusSingleButtonComponent
