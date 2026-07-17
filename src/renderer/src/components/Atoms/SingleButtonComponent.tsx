import { Button, Flex } from '@mantine/core'
import { useGlobalContext } from '../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { HeadingMediumSemiBold } from '../AllText/Text'
type ComponentProps = {
  label: string
  buttonLabel: string
  writeAddress: string
}

const SingleButtonComponent = ({ label, buttonLabel, writeAddress }: ComponentProps) => {
  const { writeMultipleValuesToPlc } = useGlobalContext()

  return (
    <Flex w="100%" justify="space-between" pl={16} pr={16}>
      <Flex align="center">
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
            writeMultipleValuesToPlc([{ address: writeAddress, value: true }])
          }}
        >
          {buttonLabel}
        </Button>
      </Flex>
    </Flex>
  )
}

export default SingleButtonComponent
