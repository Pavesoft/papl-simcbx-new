import { Checkbox, Divider, Flex, NumberInput, Switch, Text } from '@mantine/core'
import { useViewModelContext } from '../../ViewModelContextProvider'

const Stage6 = () => {
  const { form } = useViewModelContext()
  return (
    <Flex direction={'column'}>
      <Flex
        bg="#262626"
        w={'100%'}
        style={{ borderRadius: '8px 8px 0px 0px' }}
        align={'center'}
        pl={16}
      >
        <Switch size="sm" {...form.getInputProps('stage6Check', { type: 'checkbox' })} />
        <Text size="24px" fw={600} c="#F0E9F1" pl={10} pt={4} pb={4}>
          STAGE 6
        </Text>
      </Flex>

      <Flex
        style={{ borderRadius: '0px 0px 8px 8px ' }}
        bg="#171717"
        w={'100%'}
        direction="column"
        rowGap={16}
        p={16}
      >
        <Flex>
          <Flex w={'40%'}>
            <Checkbox
              mt={38}
              size="md"
              disabled={!form.values.stage6Check}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  BEARING CYL
                </Text>
              }
              {...form.getInputProps('S6BearingCyl', { type: 'checkbox' })}
            />
          </Flex>
          <Flex w={'60%'} justify="space-between">
            <Flex direction="column" rowGap={12}>
              <Text fw={600} size="lg" c="#E4E4E7">
                FWD
              </Text>
              <Checkbox
                size="md"
                disabled={!form.values.stage6Check}
                {...form.getInputProps('S6BearingCylForward', { type: 'checkbox' })}
              />
            </Flex>

            <Flex direction="column" rowGap={12}>
              <Text fw={600} size="lg" c="#E4E4E7">
                TIME
              </Text>
              <Flex direction="column">
                <NumberInput
                  hideControls
                  placeholder="0"
                  decimalScale={2}
                  fixedDecimalScale
                  w={133}
                  min={0.1}
                  max={10}
                  disabled={!form.values.stage6Check}
                  styles={{
                    input: {
                      borderColor: '#737373',
                      backgroundColor: '#F5F5F5',
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#3F3F47'
                    },
                    label: {
                      fontSize: '18px'
                    }
                  }}
                  {...form.getInputProps('S6BearingCylTime')}
                />
                <Text size="md" c="#A1A1A1" fw={500}>
                  SEC
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Divider />
        <Flex>
          <Flex w={'45%'}>
            <Checkbox
              size="md"
              disabled={!form.values.stage6Check}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  BEARING CHECK TIME
                </Text>
              }
              {...form.getInputProps('bearingAngleCheck', { type: 'checkbox' })}
            />
          </Flex>
          <Flex w={'55%'} justify="flex-end">
            <Flex direction="column">
              <NumberInput
                hideControls
                placeholder="0"
                allowDecimal={false}
                w={95}
                decimalScale={2}
                fixedDecimalScale
                min={0.1}
                max={10}
                disabled={!form.values.stage6Check}
                styles={{
                  input: {
                    borderColor: '#737373',
                    backgroundColor: '#F5F5F5',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#3F3F47'
                  },
                  label: {
                    fontSize: '18px'
                  }
                }}
                {...form.getInputProps('bearingAngleValue')}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                SEC
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Divider />
        <Flex>
          <Flex w={'45%'}>
            <Checkbox
              size="md"
              mt={28}
              disabled={!form.values.stage6Check}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  BOP
                </Text>
              }
              {...form.getInputProps('s6BopCheck', { type: 'checkbox' })}
            />
          </Flex>
          <Flex w={'55%'} justify="flex-end">
            <Flex direction="column">
              <Text fw={600} size="lg" c="#E4E4E7">
                SCENE NO.
              </Text>

              <NumberInput
                hideControls
                placeholder="0"
                w={186}
                allowDecimal={false}
                disabled={!form.values.stage6Check}
                styles={{
                  input: {
                    borderColor: '#737373',
                    backgroundColor: '#F5F5F5',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#3F3F47'
                  },
                  label: {
                    fontSize: '18px'
                  }
                }}
                {...form.getInputProps('s6SceneNo')}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Stage6
