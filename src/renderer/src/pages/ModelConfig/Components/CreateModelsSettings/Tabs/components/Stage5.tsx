import { Checkbox, Divider, Flex, NumberInput, Switch, Text } from '@mantine/core'
import { useCreateModelContext } from '../../CreateModelContextProvider'

const Stage5 = () => {
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
        <Switch size="sm" {...form.getInputProps('stage5Check', { type: 'checkbox' })} />
        <Text size="24px" fw={600} c="#F0E9F1" pl={10} pt={4} pb={4}>
          STAGE 5
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
              disabled={!form.values.stage5Check}
              mt={38}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  CLAMP
                </Text>
              }
              {...form.getInputProps('s5Champ', { type: 'checkbox' })}
            />
          </Flex>
          <Flex w={'55%'} justify="space-between">
            <Flex direction="column" rowGap={12}>
              <Text fw={600} size="lg" c="#E4E4E7">
                FWD
              </Text>
              <Checkbox
                size="md"
                {...form.getInputProps('s5ClampForward', { type: 'checkbox' })}
                disabled={!form.values.stage5Check}
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
                  {...form.getInputProps('s5ClampTime')}
                  disabled={!form.values.stage5Check}
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
              disabled={!form.values.stage5Check}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  LOAD CELL CYL RD
                </Text>
              }
              {...form.getInputProps('s5LoadCellCyl', { type: 'checkbox' })}
            />
          </Flex>

          <Flex w={'55%'} justify="space-between">
            <Checkbox
              size="md"
              {...form.getInputProps('s5LoadCellCylForward', { type: 'checkbox' })}
              disabled={!form.values.stage5Check}
            />

            <Flex direction="column">
              <NumberInput
                hideControls
                placeholder="0"
                w={95}
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
                {...form.getInputProps('s5LoadCellCylTime')}
                disabled={!form.values.stage5Check}
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
            label={
              <Text fw={600} size="lg" c="#E4E4E7">
                CB LOAD
              </Text>
            }
            {...form.getInputProps('s5CbLoad', { type: 'checkbox' })}
            disabled={!form.values.stage5Check}
          />
          <Checkbox
            size="md"
            label={
              <Text fw={600} size="lg" c="#E4E4E7">
                CB PRESSING LOAD
              </Text>
            }
            {...form.getInputProps('s5CbPressingLoad', { type: 'checkbox' })}
            disabled={!form.values.stage5Check}
          />
        </Flex>
        <Checkbox
          size="md"
          label={
            <Text fw={600} size="lg" c="#E4E4E7">
              CB LOAD COMPARISION
            </Text>
          }
          {...form.getInputProps('s5CbLoadComparison', { type: 'checkbox' })}
          disabled={!form.values.stage5Check}
        />
        <Divider />
        <Flex>
          <Flex w={'40%'} align="center">
            <Text fw={600} size="lg" c="#E4E4E7">
              CB 2 BRUSH PARTIAL PRESS LOAD
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
                disabled={!form.values.stage5Check}
                {...form.getInputProps('s5Cb2BrushPartialLoadMin')}
                onChange={(e) => {
                  const value = Number(e)
                  form.setFieldValue('s5Cb2BrushPartialLoadMin', value)
                  if (value >= form.values.s5Cb2BrushPartialLoadMax) {
                    form.setFieldValue('s5Cb2BrushPartialLoadMax', value + 0.1)
                  }
                }}
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
                min={form.values.s5Cb2BrushPartialLoadMin + 0.1}
                max={5}
                decimalScale={2}
                fixedDecimalScale
                disabled={!form.values.stage5Check}
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
                {...form.getInputProps('s5Cb2BrushPartialLoadMax')}
              />

              <Text size="md" c="#A1A1A1" fw={500}>
                NEWTON
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {form.values.s5Cb2BrushPartialLoadMax <= form.values.s5Cb2BrushPartialLoadMin && (
          <Text c="#FF0000" size="sm" mt={8} ta={'end'}>
            MAX should be greater than MIN
          </Text>
        )}
        <Flex>
          <Flex w={'40%'} align="center">
            <Text fw={600} size="lg" c="#E4E4E7">
              CB 2 BRUSH FULL PRESS LOAD
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
                max={5}
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
                disabled={!form.values.stage5Check}
                {...form.getInputProps('s5Cb2BrushFullLoadMin')}
                onChange={(e) => {
                  const value = Number(e)
                  form.setFieldValue('s5Cb2BrushFullLoadMin', value)
                  if (value >= form.values.s5Cb2BrushFullLoadMax) {
                    form.setFieldValue('s5Cb2BrushFullLoadMax', value + 0.1)
                  }
                }}
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
                min={form.values.s5Cb2BrushFullLoadMin}
                max={5}
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
                {...form.getInputProps('s5Cb2BrushFullLoadMax')}
                disabled={!form.values.stage5Check}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                NEWTON
              </Text>
            </Flex>
          </Flex>
        </Flex>
        {form.values.s5Cb2BrushFullLoadMax <= form.values.s5Cb2BrushFullLoadMin && (
          <Text c="#FF0000" size="sm" mt={8} ta={'end'}>
            MAX should be greater than MIN
          </Text>
        )}
        <Divider />

        <Flex>
          <Flex w={'40%'} align="center">
            <Text fw={600} size="lg" c="#E4E4E7">
              CB 2 PARTIAL PRESS
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
                {...form.getInputProps('s5Cb2PartialPressPosition')}
                disabled={!form.values.stage5Check}
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
                w={95}
                min={0.1}
                decimalScale={2}
                fixedDecimalScale
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
                {...form.getInputProps('s5Cb2PartialPressSpeed')}
                disabled={!form.values.stage5Check}
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
              CB 2 FULL PRESS
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
                {...form.getInputProps('s5Cb2FullPressPosition')}
                disabled={!form.values.stage5Check}
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
                w={95}
                min={0.1}
                decimalScale={2}
                fixedDecimalScale
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
                {...form.getInputProps('s5Cb2FullPressSpeed')}
                disabled={!form.values.stage5Check}
              />
              <Text size="md" c="#A1A1A1" fw={500}>
                MM/SEC
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
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  BOP
                </Text>
              }
              {...form.getInputProps('s5BopCheck', { type: 'checkbox' })}
              disabled={!form.values.stage5Check}
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
                {...form.getInputProps('s5SceneNo')}
                disabled={!form.values.stage5Check}
              />
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Stage5
