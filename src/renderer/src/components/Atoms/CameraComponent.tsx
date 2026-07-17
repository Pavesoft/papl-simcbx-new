import { Button, Flex, Indicator, NumberInput, Text } from '@mantine/core'
import { HeadingMediumSemiBold } from '../AllText/Text'
import { useState } from 'react'
import { useGlobalContext } from '../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'

type ComponentProps = {
  componentName: string
  opHealthAddress: string
  btnCameraScene: string
  btnCameraTrigger: string
  cameraSceneAddress: string
}
const CameraComponent = ({
  componentName,
  opHealthAddress,
  btnCameraScene,
  btnCameraTrigger,
  cameraSceneAddress
}: ComponentProps) => {
  const { writeMultipleValuesToPlc, readValueFromPlc } = useGlobalContext()
  const [cameraScene, setCameraScene] = useState<number>(0)

  const opHealth = readValueFromPlc(opHealthAddress)

  const onSceneChange = () => {
    writeMultipleValuesToPlc([{ address: cameraSceneAddress, value: cameraScene }])
    writeMultipleValuesToPlc([{ address: btnCameraScene, value: true }])
  }
  return (
    <Flex pl={16} pr={16} direction="column">
      <Flex align="center" columnGap={12}>
        <Indicator color={opHealth ? 'green' : 'red'} size={12} processing />
        <HeadingMediumSemiBold color="#F0E9F1">{componentName}</HeadingMediumSemiBold>
      </Flex>
      <Flex justify={'space-between'} pl={12}>
        <Flex direction="column">
          <NumberInput
            hideControls
            allowDecimal={false}
            placeholder="0"
            w={148}
            value={cameraScene}
            styles={{
              input: {
                borderColor: '#737373',
                backgroundColor: '#F5F5F5',
                fontSize: '20px',
                fontWeight: 600,
                color: '#3F3F47'
              },
              label: {
                fontSize: '24px'
              }
            }}
            onChange={(value) => setCameraScene(Number(value))}
          />
          <Text size="lg" c="#A1A1A1">
            NO
          </Text>
        </Flex>
        <Flex columnGap={8}>
          <Button
            className="jog-button"
            onMouseDown={() => onSceneChange()}
            onMouseUp={() => writeMultipleValuesToPlc([{ address: btnCameraScene, value: false }])}
            size="md"
          >
            SCENE CHANGE
          </Button>
          <Button
            className="jog-button"
            onMouseDown={() =>
              writeMultipleValuesToPlc([{ address: btnCameraTrigger, value: true }])
            }
            onMouseUp={() =>
              writeMultipleValuesToPlc([{ address: btnCameraTrigger, value: false }])
            }
            size="md"
          >
            TRIGGER
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default CameraComponent
