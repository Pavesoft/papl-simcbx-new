import { Checkbox, Divider, Flex, NumberInput, Switch, Text } from '@mantine/core'
import { useCreateModelContext } from '../../CreateModelContextProvider'

const Stage4 = () => {
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
        <Switch size="sm" {...form.getInputProps('stage4Check', { type: 'checkbox' })} />
        <Text size="24px" fw={600} c="#F0E9F1" pl={10} pt={4} pb={4}>
          STAGE 4
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
          <Flex w={'45%'}>
            <Checkbox
              size="md"
              disabled={!form.values.stage4Check}
              mt={38}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  CLAMP
                </Text>
              }
              {...form.getInputProps('s4Clamp', { type: 'checkbox' })}
            />
          </Flex>
          <Flex w={'55%'} justify="space-between">
            <Flex direction="column" rowGap={12}>
              <Text fw={600} size="lg" c="#E4E4E7">
                FWD
              </Text>
              <Checkbox
                size="md"
                {...form.getInputProps('s4ClampForward', { type: 'checkbox' })}
                disabled={!form.values.stage4Check}
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
                  decimalScale={2}
                  fixedDecimalScale
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
                  {...form.getInputProps('s4ClampTime')}
                  disabled={!form.values.stage4Check}
                />
                <Text size="md" c="#A1A1A1" fw={500}>
                  SEC
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Flex>

        <Flex>
          <Flex w={'45%'}>
            <Checkbox
              size="md"
              disabled={!form.values.stage4Check}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  LOAD CELL CYL RD
                </Text>
              }
              {...form.getInputProps('s4LoadCellCyl', { type: 'checkbox' })}
            />
          </Flex>
          <Flex w={'55%'} justify="space-between">
            <Checkbox
              size="md"
              {...form.getInputProps('s4LoadCellCylForward', { type: 'checkbox' })}
              disabled={!form.values.stage4Check}
            />

            <Flex direction="column">
              <NumberInput
                hideControls
                placeholder="0"
                w={95}
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale
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
                {...form.getInputProps('s4LoadCellCylTime')}
                disabled={!form.values.stage4Check}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                SEC
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Divider />
        <Flex columnGap={24}>
          <Checkbox
            size="md"
            disabled={!form.values.stage4Check}
            label={
              <Text fw={600} size="lg" c="#E4E4E7">
                CB LOAD
              </Text>
            }
            {...form.getInputProps('s4CbLoad', { type: 'checkbox' })}
          />
          <Checkbox
            size="md"
            disabled={!form.values.stage4Check}
            label={
              <Text fw={600} size="lg" c="#E4E4E7">
                CB PRESSING LOAD
              </Text>
            }
            {...form.getInputProps('s4CbPressingLoad', { type: 'checkbox' })}
          />
        </Flex>
        <Divider />
        <Flex>
          <Flex w={'40%'} align="center">
            <Text fw={600} size="lg" c="#E4E4E7">
              CB 1 BRUSH PARTIAL PRESS LOAD
            </Text>
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
                decimalScale={2}
                fixedDecimalScale
                min={0.1}
                max={5}
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
                disabled={!form.values.stage4Check}
                {...form.getInputProps('s4Cb1BrushPartialLoadMin')}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                NEWTON
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
                min={form.values.s4Cb1BrushPartialLoadMin + 0.1}
                decimalScale={2}
                fixedDecimalScale
                max={5}
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
                disabled={!form.values.stage4Check}
                {...form.getInputProps('s4Cb1BrushPartialLoadMax')}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                NEWTON
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {form.values.s4Cb1BrushPartialLoadMax <= form.values.s4Cb1BrushPartialLoadMin && (
          <Text c="#FF0000" size="sm" mt={8} ta={'end'}>
            MAX should be greater than MIN
          </Text>
        )}
        <Flex>
          <Flex w={'40%'} align="center">
            <Text fw={600} size="lg" c="#E4E4E7">
              CB 1 BRUSH FULL PRESS LOAD
            </Text>
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
                min={0.1}
                decimalScale={2}
                fixedDecimalScale
                max={5}
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
                disabled={!form.values.stage4Check}
                {...form.getInputProps('s4Cb1BrushFullLoadMin')}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                NEWTON
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
                min={0.1}
                decimalScale={2}
                fixedDecimalScale
                max={5}
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
                disabled={!form.values.stage4Check}
                {...form.getInputProps('s4Cb1BrushFullLoadMax')}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                NEWTON
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {form.values.s4Cb1BrushFullLoadMax <= form.values.s4Cb1BrushFullLoadMin && (
          <Text c="#FF0000" size="sm" mt={8} ta={'end'}>
            MAX should be greater than MIN
          </Text>
        )}
        <Divider />
        <Flex>
          <Flex w={'40%'} align="center">
            <Text fw={600} size="lg" c="#E4E4E7">
              CB 1 PARTIAL PRESS
            </Text>
          </Flex>
          <Flex w={'60%'} justify="flex-end" columnGap={16}>
            <Flex direction="column">
              <Text fw={600} size="lg" c="#E4E4E7">
                POSITION
              </Text>
              <NumberInput
                hideControls
                placeholder="0"
                w={95}
                min={0}
                max={12}
                fixedDecimalScale
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
                    fontSize: '18px'
                  }
                }}
                {...form.getInputProps('s4Cb1PartialPressPosition')}
                disabled={!form.values.stage4Check}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                MM
              </Text>
            </Flex>
            <Flex direction="column">
              <Text fw={600} size="lg" c="#E4E4E7">
                SPEED
              </Text>
              <NumberInput
                hideControls
                placeholder="0"
                w={95}
                decimalScale={2}
                fixedDecimalScale
                allowDecimal={true}
                min={0.1}
                max={2.5}
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
                {...form.getInputProps('s4Cb1PartialPressSpeed')}
                disabled={!form.values.stage4Check}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                MM/SEC
              </Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex>
          <Flex w={'40%'} align="center">
            <Text fw={600} size="lg" c="#E4E4E7">
              CB 1 FULL PRESS
            </Text>
          </Flex>
          <Flex w={'60%'} justify="flex-end" columnGap={16}>
            <Flex direction="column">
              <Text fw={600} size="lg" c="#E4E4E7">
                POSITION
              </Text>
              <NumberInput
                hideControls
                placeholder="0"
                w={95}
                fixedDecimalScale
                min={0}
                max={12}
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
                    fontSize: '18px'
                  }
                }}
                {...form.getInputProps('s4Cb1FullPressPosition')}
                disabled={!form.values.stage4Check}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                MM
              </Text>
            </Flex>
            <Flex direction="column">
              <Text fw={600} size="lg" c="#E4E4E7">
                SPEED
              </Text>
              <NumberInput
                hideControls
                placeholder="0"
                allowDecimal={true}
                decimalScale={2}
                fixedDecimalScale
                w={95}
                min={0.1}
                max={2.5}
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
                {...form.getInputProps('s4Cb1FullPressSpeed')}
                disabled={!form.values.stage4Check}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                MM/SEC
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Stage4
