import { Button, Flex } from '@mantine/core'
import { IconMinus, IconPlus } from '@tabler/icons-react'
import { useGlobalContext } from '../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'

type ComponentProps = {
  jogPlusWriteAddress: string
  jogMinusWriteAddress: string
}
const Jog = ({ jogPlusWriteAddress, jogMinusWriteAddress }: ComponentProps) => {
  const { writeMultipleValuesToPlc } = useGlobalContext()

  return (
    <Flex direction="column" pl={16} pr={16}>
      <Flex columnGap={8} justify="flex-end">
        <Button
          className="jog-button"
          rightSection={<IconMinus size={16} />}
          onMouseDown={(e) => {
            e.preventDefault()
            writeMultipleValuesToPlc([{ address: jogMinusWriteAddress, value: true }])
          }}
          onMouseUp={(e) => {
            e.preventDefault()
            writeMultipleValuesToPlc([{ address: jogMinusWriteAddress, value: false }])
          }}
        >
          JOG
        </Button>

        <Button
          className="jog-button"
          rightSection={<IconPlus size={16} />}
          onMouseDown={(e) => {
            e.preventDefault()
            writeMultipleValuesToPlc([{ address: jogPlusWriteAddress, value: true }])
          }}
          onMouseUp={(e) => {
            e.preventDefault()
            writeMultipleValuesToPlc([{ address: jogPlusWriteAddress, value: false }])
          }}
        >
          JOG
        </Button>
      </Flex>
    </Flex>
  )
}

export default Jog
