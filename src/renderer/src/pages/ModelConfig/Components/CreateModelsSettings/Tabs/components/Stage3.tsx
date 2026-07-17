import { Checkbox, Divider, Flex, NumberInput, Switch, Text } from '@mantine/core'
import { useCreateModelContext } from '../../CreateModelContextProvider'

const Stage3 = () => {
  const { form } = useCreateModelContext()
  return (
    <Flex direction={'column'}>
      <Flex
        bg="#262626"
        w={'100%'}
        style={{ borderRadius: '8px 8px 0px 0px' }}
        align={'center'}
        pl={16}
      >
        <Switch size="sm" {...form.getInputProps('stage3Check', { type: 'checkbox' })} />
        <Text size="24px" fw={600} c="#F0E9F1" pl={10} pt={4} pb={4}>
          STAGE 3
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
              size="md"
              disabled={!form.values.stage3Check}
              mt={38}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  PROBE CYL 1
                </Text>
              }
              {...form.getInputProps('S3ProbeCyl1', { type: 'checkbox' })}
            />
          </Flex>
          <Flex w={'60%'} justify="space-between">
            <Flex direction="column" rowGap={12}>
              <Text fw={600} size="lg" c="#E4E4E7">
                FWD
              </Text>
              <Checkbox
                size="md"
                {...form.getInputProps('S3PC1Forward', { type: 'checkbox' })}
                disabled={!form.values.stage3Check}
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
                  w={95}
                  allowNegative={false}
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
                  {...form.getInputProps('S3PC1Time')}
                  disabled={!form.values.stage3Check}
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
              disabled={!form.values.stage3Check}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  PROBE CYL 2
                </Text>
              }
              {...form.getInputProps('S3ProbeCyl2', { type: 'checkbox' })}
            />
          </Flex>
          <Flex w={'60%'} justify="space-between">
            <Checkbox
              size="md"
              {...form.getInputProps('S3PC2Forward', { type: 'checkbox' })}
              disabled={!form.values.stage3Check}
            />

            <Flex direction="column">
              <NumberInput
                hideControls
                placeholder="0"
                w={95}
                allowNegative={false}
                min={0.1}
                max={10}
                decimalScale={2}
                fixedDecimalScale
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
                {...form.getInputProps('S3PC2Time')}
                disabled={!form.values.stage3Check}
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
              disabled={!form.values.stage3Check}
              mt={38}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  IMPEDANCE
                </Text>
              }
              {...form.getInputProps('impedance', { type: 'checkbox' })}
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
                w={95}
                allowNegative={false}
                min={0.1}
                decimalScale={2}
                fixedDecimalScale
                max={2}
                disabled={!form.values.stage3Check}
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
                {...form.getInputProps('impedanceMin')}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                μF
              </Text>
            </Flex>
            <Flex direction="column">
              <Text fw={600} size="lg" c="#E4E4E7">
                MAX
              </Text>
              <NumberInput
                hideControls
                placeholder="0"
                w={95}
                decimalScale={2}
                fixedDecimalScale
                min={0.1}
                max={2}
                disabled={!form.values.stage3Check}
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
                {...form.getInputProps('impedanceMax')}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                μF
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {form.values.impedanceMax <= form.values.impedanceMin && (
          <Text c="#FF0000" size="sm" mt={8}>
            Max impedance must be greater than Min impedance.
          </Text>
        )}
      </Flex>
    </Flex>
  )
}

export default Stage3
