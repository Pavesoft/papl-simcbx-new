import { ActionIcon, Button, Flex, Indicator } from '@mantine/core'
import { IconSmartHome } from '@tabler/icons-react'
import { useGlobalContext } from '../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { HeadingMediumSemiBold } from '../AllText/Text'

type ComponentProps = {
  label: string
  initialWriteAddress: string
  pressWriteAddress: string
  loadWriteAddress: string
  homeWriteAddress: string
  opHealthAddress: string
}
const ServoPositionComponent = ({
  label,
  opHealthAddress,
  homeWriteAddress,
  loadWriteAddress,
  initialWriteAddress,
  pressWriteAddress
}: ComponentProps) => {
  const { writeMultipleValuesToPlc, readValueFromPlc } = useGlobalContext()
  return (
    <Flex direction="column" pl={16} pr={16} rowGap={24}>
      <Flex w="100%" justify="space-between">
        <Flex columnGap={12}>
          <Indicator
            color={readValueFromPlc(opHealthAddress) ? 'green' : 'red'}
            size={12}
            processing
            mt={14}
          />
          <HeadingMediumSemiBold color="#F0E9F1">{label}</HeadingMediumSemiBold>
        </Flex>
        <Flex>
          <Flex direction="column" rowGap={8}>
            <Flex columnGap={8}>
              <Button
                w={94}
                className="jog-button"
                style={{ border: '1px solid #525252' }}
                onMouseDown={() =>
                  writeMultipleValuesToPlc([{ address: initialWriteAddress, value: true }])
                }
                onMouseUp={() =>
                  writeMultipleValuesToPlc([{ address: initialWriteAddress, value: false }])
                }
              >
                INITIAL
              </Button>
              <Button
                w={94}
                className="jog-button"
                style={{ border: '1px solid #525252' }}
                onMouseDown={() =>
                  writeMultipleValuesToPlc([{ address: pressWriteAddress, value: true }])
                }
                onMouseUp={() =>
                  writeMultipleValuesToPlc([{ address: pressWriteAddress, value: false }])
                }
              >
                PRESS
              </Button>
            </Flex>
            <Flex columnGap={8}>
              <Button
                className="jog-button"
                w={94}
                style={{ border: '1px solid #525252' }}
                onMouseDown={() =>
                  writeMultipleValuesToPlc([{ address: loadWriteAddress, value: true }])
                }
                onMouseUp={() =>
                  writeMultipleValuesToPlc([{ address: loadWriteAddress, value: false }])
                }
              >
                LOAD
              </Button>
              <ActionIcon
                size="lg"
                w={94}
                h={36}
                className="jog-button"
                style={{ border: '1px solid #525252' }}
                onMouseDown={() =>
                  writeMultipleValuesToPlc([{ address: homeWriteAddress, value: true }])
                }
                onMouseUp={() =>
                  writeMultipleValuesToPlc([{ address: homeWriteAddress, value: false }])
                }
              >
                <IconSmartHome color="#E5E5E5" />
              </ActionIcon>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default ServoPositionComponent
