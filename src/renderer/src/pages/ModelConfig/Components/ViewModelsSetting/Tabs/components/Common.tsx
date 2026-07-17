import { Checkbox, Divider, Flex, NumberInput, Text, TextInput } from '@mantine/core'
import { useViewModelContext } from '../../ViewModelContextProvider'

const Common = () => {
  const { form } = useViewModelContext()
  return (
    <Flex direction={'column'}>
      <Flex bg="#262626" w={'100%'} style={{ borderRadius: '8px 8px 0px 0px' }}>
        <Text size="24px" fw={600} c="#F0E9F1" pl={16} pt={4} pb={4}>
          COMMON
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
        <Flex justify="space-between" align="center">
          <Text fw={600} size="lg" c="#E4E4E7">
            MODEL NAME
          </Text>
          <TextInput
            w={186}
            h={36}
            placeholder="MODEL NAME"
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
            {...form.getInputProps('modelName')}
          />
        </Flex>
        <Divider />
        <Flex justify="space-between" align="center">
          <Text fw={600} size="lg" c="#E4E4E7">
            PROGRAM NO.
          </Text>
          <NumberInput
            hideControls
            allowDecimal={false}
            allowNegative={false}
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
                fontSize: '24px'
              }
            }}
            {...form.getInputProps('programNo')}
          />
        </Flex>

        <Divider />
        <Checkbox
          size="md"
          label={
            <Text fw={600} size="lg" c="#E4E4E7">
              REJECTION BIN
            </Text>
          }
          {...form.getInputProps('rejectionBin', { type: 'checkbox' })}
        />
        <Checkbox
          size="md"
          label={
            <Text fw={600} size="lg" c="#E4E4E7">
              LIGHT CURTAIN
            </Text>
          }
          {...form.getInputProps('lightCurtain', { type: 'checkbox' })}
        />
        <Checkbox
          size="md"
          label={
            <Text fw={600} size="lg" c="#E4E4E7">
              DOOR LIMIT SWITCH
            </Text>
          }
          {...form.getInputProps('doorLimitSwitch', { type: 'checkbox' })}
        />
      </Flex>
    </Flex>
  )
}

export default Common
