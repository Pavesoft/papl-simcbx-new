import { Checkbox, Divider, Flex, NumberInput, Switch, Text } from '@mantine/core'
import { useViewModelContext } from '../../ViewModelContextProvider'

const Stage2 = () => {
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
        <Switch size="sm" {...form.getInputProps('stage2Check', { type: 'checkbox' })} />
        <Text size="24px" fw={600} c="#F0E9F1" pl={10} pt={4} pb={4}>
          STAGE 2
        </Text>
      </Flex>
      <Flex
        style={{ borderRadius: '0px 0px 8px 8px' }}
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
              disabled={!form.values.stage2Check}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  PROBE CYL 1
                </Text>
              }
              {...form.getInputProps('s2ProbeCyl1', { type: 'checkbox' })}
            />
          </Flex>
          <Flex w={'60%'} justify="space-between">
            <Flex direction="column" rowGap={12}>
              <Text fw={600} size="lg" c="#E4E4E7">
                FWD
              </Text>
              <Checkbox
                size="md"
                {...form.getInputProps('s2PC1Forward', { type: 'checkbox' })}
                disabled={!form.values.stage2Check}
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
                  disabled={!form.values.stage2Check}
                  allowNegative={false}
                  w={95}
                  min={0.1}
                  max={10}
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
                  {...form.getInputProps('s2PC1Time')}
                />
                <Text size="md" c="#A1A1A1" fw={500}>
                  SEC
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <Flex w={'40%'}>
            <Checkbox
              size="md"
              disabled={!form.values.stage2Check}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  PROBE CYL 2
                </Text>
              }
              {...form.getInputProps('s2ProbeCyl2', { type: 'checkbox' })}
            />
          </Flex>
          <Flex w={'60%'} justify="space-between">
            <Checkbox
              size="md"
              {...form.getInputProps('s2PC2Forward', { type: 'checkbox' })}
              disabled={!form.values.stage2Check}
            />

            <Flex direction="column">
              <NumberInput
                hideControls
                placeholder="0"
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale
                disabled={!form.values.stage2Check}
                min={0.1}
                max={10}
                w={95}
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
                {...form.getInputProps('s2PC2Time')}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                SEC
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Divider />
        <Flex>
          <Flex w={'40%'}>
            <Checkbox
              size="md"
              disabled={!form.values.stage2Check}
              mt={38}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  RESISTANCE
                </Text>
              }
              {...form.getInputProps('resistance', { type: 'checkbox' })}
            />
          </Flex>
          <Flex w={'60%'} justify="flex-end" columnGap={16}>
            <Flex direction="column">
              <Text fw={600} size="lg" c="#E4E4E7">
                MIN
              </Text>
              <NumberInput
                hideControls
                placeholder="0"
                decimalScale={2}
                fixedDecimalScale
                disabled={!form.values.stage2Check}
                w={95}
                min={0.1}
                max={500}
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
                {...form.getInputProps('resistanceMin')}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                mΩ
              </Text>
            </Flex>
            <Flex direction="column">
              <Text fw={600} size="lg" c="#E4E4E7">
                MAX
              </Text>
              <NumberInput
                hideControls
                placeholder="0"
                decimalScale={2}
                fixedDecimalScale
                disabled={!form.values.stage2Check}
                w={95}
                min={0.1}
                max={500}
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
                {...form.getInputProps('resistanceMax')}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                mΩ
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Stage2
