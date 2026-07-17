import { Button, Flex, NumberInput, Text } from '@mantine/core'
import { convertFloatToWord, convertIntToWord } from '../../shared/util/general.util'
import { useState } from 'react'
import { useGlobalContext } from '../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'

type ComponentProps = {
  positionLowWordAddress: string
  positionHighWordAddress: string
  speedLowWordAddress: string
  speedHighWordAddress: string
  goBtnWriteAddress: string
  speedMax?: number
  positionMax?: number
}

const SpeedPositionComponent = ({
  positionLowWordAddress,
  positionHighWordAddress,
  speedLowWordAddress,
  speedHighWordAddress,
  goBtnWriteAddress,
  speedMax,
  positionMax
}: ComponentProps) => {
  const [position, setPosition] = useState<number>(0)
  const [speed, setSpeed] = useState<number>(0)

  const { writeMultipleValuesToPlc } = useGlobalContext()

  return (
    <Flex direction="column" pl={16} pr={16} rowGap={12}>
      <Flex w="100%" justify="space-between" align="center">
        <Flex direction="column">
          <NumberInput
            hideControls
            label="POSITION"
            placeholder="0"
            w={148}
            fixedDecimalScale
            min={0}
            max={positionMax || 12}
            decimalScale={3}
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
            value={position}
            onChange={(value) => setPosition(Number(value))}
          />
          <Text size="lg" c="#A1A1A1">
            MM
          </Text>
        </Flex>
        <Flex direction="column">
          <NumberInput
            hideControls
            label="SPEED"
            placeholder="0"
            min={0.1}
            max={speedMax || 2.5}
            fixedDecimalScale
            decimalScale={3}
            w={148}
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
            value={speed}
            onChange={(value) => setSpeed(Number(value))}
          />
          <Text size="lg" c="#A1A1A1">
            MM/SEC
          </Text>
        </Flex>
        <Button
          w={94}
          h={36}
          mt={8}
          className="jog-button"
          style={{ border: '1px solid #525252' }}
          onMouseDown={() => {
            const { low: positionLowWord, high: positionHighWord } = convertIntToWord(
              position * 1000
            )
            const { low: speedLowWord, high: speedHighWord } = convertFloatToWord(speed)

            writeMultipleValuesToPlc([
              { address: 'D669', value: 0 },
              { address: positionLowWordAddress, value: positionLowWord },
              { address: positionHighWordAddress, value: positionHighWord },
              { address: speedLowWordAddress, value: speedLowWord },
              { address: speedHighWordAddress, value: speedHighWord },
              { address: goBtnWriteAddress, value: true }
            ])
          }}
          onMouseUp={() => {
            writeMultipleValuesToPlc([{ address: goBtnWriteAddress, value: false }])
          }}
        >
          GO
        </Button>
      </Flex>
    </Flex>
  )
}

export default SpeedPositionComponent
