import { Checkbox, Divider, Flex, NumberInput, Switch, Text } from '@mantine/core'
import { useCreateModelContext } from '../../CreateModelContextProvider'

const Stage8 = () => {
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
        <Switch size="sm" {...form.getInputProps('stage8Check', { type: 'checkbox' })} />
        <Text size="24px" fw={600} c="#F0E9F1" pl={10} pt={4} pb={4}>
          STAGE 8
        </Text>
      </Flex>
      <Flex
        style={{ borderRadius: '0px 0px 8px 8px ' }}
        bg="#171717"
        w={'100%'}
        direction="column"
        // style={{ border: "1px solid #ccc" }}
        rowGap={16}
        p={16}
      >
        <Flex>
          <Flex w={'40%'}>
            <Checkbox
              mt={38}
              size="md"
              disabled={!form.values.stage8Check}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  UP/DOWN CYL
                </Text>
              }
              {...form.getInputProps('upDownCylCheck', { type: 'checkbox' })}
            />
          </Flex>
          <Flex w={'60%'} justify="space-between">
            <Flex direction="column" rowGap={12}>
              <Text fw={600} size="lg" c="#E4E4E7">
                UP
              </Text>
              <Checkbox
                size="md"
                disabled={!form.values.stage8Check}
                {...form.getInputProps('upDownCylUp', { type: 'checkbox' })}
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
                  w={95}
                  min={0.1}
                  max={10}
                  disabled={!form.values.stage8Check}
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
                  {...form.getInputProps('upDownCylTime')}
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
          <Flex w={'40%'}>
            <Checkbox
              mt={38}
              size="md"
              disabled={!form.values.stage8Check}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  GRIPPER
                </Text>
              }
              {...form.getInputProps('gripperCheck', { type: 'checkbox' })}
            />
          </Flex>
          <Flex w={'60%'} justify="space-between">
            <Flex direction="column" rowGap={12}>
              <Text fw={600} size="lg" c="#E4E4E7">
                GRIP
              </Text>
              <Checkbox
                size="md"
                disabled={!form.values.stage8Check}
                {...form.getInputProps('gripperGrip', { type: 'checkbox' })}
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
                  decimalScale={2}
                  fixedDecimalScale
                  min={0.1}
                  max={10}
                  disabled={!form.values.stage8Check}
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
                  {...form.getInputProps('gripperTime')}
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
              mt={28}
              disabled={!form.values.stage8Check}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  SCAN
                </Text>
              }
              {...form.getInputProps('scanCheck', { type: 'checkbox' })}
            />
          </Flex>
        </Flex>
        <Divider />
        <Flex justify="space-between" align="center">
          <Text fw={600} size="lg" c="#E4E4E7">
            SERVO SPEED
          </Text>
          <Flex direction="column">
            <NumberInput
              hideControls
              w={96}
              decimalScale={2}
              fixedDecimalScale
              h={36}
              min={0.1}
              max={200}
              disabled={!form.values.stage8Check}
              placeholder="0"
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
              style={{ borderRadius: '4px' }}
              {...form.getInputProps('servoSpeed')}
            />

            <Text size="md" c="#A1A1A1" fw={500}>
              MM/SEC
            </Text>
          </Flex>
        </Flex>
        <Divider />
        <Text fw={600} size="lg" c="#E4E4E7">
          PART
        </Text>
        <Flex columnGap={12}>
          <Flex direction="column">
            <NumberInput
              hideControls
              label="PICK POS"
              placeholder="0"
              allowDecimal={false}
              min={0}
              max={800}
              disabled={!form.values.stage8Check}
              w={133}
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
              {...form.getInputProps('partPickPOS')}
            />
            <Text size="lg" c="#A1A1A1">
              MM
            </Text>
          </Flex>
          <Flex direction="column">
            <NumberInput
              hideControls
              label="PRESS POS 1"
              placeholder="0"
              allowDecimal={true}
              decimalScale={2}
              fixedDecimalScale
              w={133}
              min={0}
              max={800}
              disabled={!form.values.stage8Check}
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
              {...form.getInputProps('pressPosition1')}
            />
            <Text size="lg" c="#A1A1A1">
              MM
            </Text>
          </Flex>
          <Flex direction="column">
            <NumberInput
              hideControls
              label="PRESS POS 2"
              placeholder="0"
              w={133}
              decimalScale={2}
              fixedDecimalScale
              min={0}
              max={800}
              allowDecimal={false}
              disabled={!form.values.stage8Check}
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
              {...form.getInputProps('pressPosition2')}
            />
            <Text size="lg" c="#A1A1A1">
              MM
            </Text>
          </Flex>
        </Flex>
        <Flex columnGap={12}>
          <Flex direction="column">
            <NumberInput
              hideControls
              label="PRESS POS 3"
              placeholder="0"
              decimalScale={2}
              fixedDecimalScale
              allowDecimal={false}
              disabled={!form.values.stage8Check}
              w={133}
              min={0}
              max={800}
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
              {...form.getInputProps('pressPosition3')}
            />
            <Text size="lg" c="#A1A1A1">
              MM
            </Text>
          </Flex>
          <Flex direction="column">
            <NumberInput
              hideControls
              label="PRESS POS 4"
              placeholder="0"
              decimalScale={2}
              fixedDecimalScale
              allowDecimal={false}
              w={133}
              min={0}
              max={800}
              disabled={!form.values.stage8Check}
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
              {...form.getInputProps('pressPosition4')}
            />
            <Text size="lg" c="#A1A1A1">
              MM
            </Text>
          </Flex>
          <Flex direction="column">
            <NumberInput
              hideControls
              label="PRESS POS 5"
              placeholder="0"
              decimalScale={2}
              fixedDecimalScale
              w={133}
              min={0}
              max={800}
              allowDecimal={false}
              disabled={!form.values.stage8Check}
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
              {...form.getInputProps('pressPosition5')}
            />
            <Text size="lg" c="#A1A1A1">
              MM
            </Text>
          </Flex>
        </Flex>
        <Flex columnGap={12}>
          <Flex direction="column">
            <NumberInput
              hideControls
              label="PRESS POS 6"
              placeholder="0"
              allowDecimal={false}
              decimalScale={2}
              fixedDecimalScale
              disabled={!form.values.stage8Check}
              w={133}
              min={0}
              max={800}
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
              {...form.getInputProps('pressPosition6')}
            />
            <Text size="lg" c="#A1A1A1">
              MM
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Stage8
