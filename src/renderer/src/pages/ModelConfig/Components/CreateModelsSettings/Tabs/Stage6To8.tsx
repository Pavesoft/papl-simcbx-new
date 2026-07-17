import { Checkbox, Flex, Switch, Text, TextInput } from '@mantine/core'
import { useCreateModelContext } from '../CreateModelContextProvider'
import Stage6 from './components/Stage6'
import Stage8 from './components/Stage8'

const Stage6To8 = () => {
  const { form } = useCreateModelContext()
  return (
    <Flex h={'calc(90vh - 50px)'} columnGap={20} mt={12}>
      <Flex w={'25%'} direction={'column'} rowGap={20}>
        <Stage6 />
        <Flex direction={'column'}>
          <Flex
            bg="#262626"
            w={'100%'}
            style={{ borderRadius: '8px 8px 0px 0px' }}
            align={'center'}
            pl={16}
          >
            <Switch size="sm" {...form.getInputProps('stage7Check', { type: 'checkbox' })} />
            <Text size="24px" fw={600} c="#F0E9F1" pl={10} pt={4} pb={4}>
              STAGE 7
            </Text>
          </Flex>
          <Flex
            style={{ borderRadius: '0px 0px 8px 8px ' }}
            bg="#171717"
            // direction="column"
            rowGap={16}
            p={16}
          >
            <Flex direction="column" rowGap={8} w={'100%'}>
              <Flex justify="space-between" w={'100%'}>
                <Checkbox
                  size="md"
                  mt={28}
                  disabled={!form.values.stage7Check}
                  label={
                    <Text fw={600} size="lg" c="#E4E4E7">
                      MARKING
                    </Text>
                  }
                  {...form.getInputProps('markingCheck', { type: 'checkbox' })}
                />
                <Flex direction="column">
                  <Text fw={600} size="lg" c="#E4E4E7">
                    PART NO.
                  </Text>

                  <TextInput
                    placeholder="0"
                    w={186}
                    disabled={!form.values.stage7Check}
                    maxLength={10}
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
                    {...form.getInputProps('partNo')}
                  />
                </Flex>
              </Flex>
              <Flex justify="space-between" w={'100%'}>
                <Flex direction="column">
                  <Text fw={600} size="lg" c="#E4E4E7">
                    DRAWING REV NO.
                  </Text>

                  <TextInput
                    placeholder="0"
                    w={186}
                    disabled={!form.values.stage7Check}
                    maxLength={1}
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
                    {...form.getInputProps('revNo')}
                    onChange={(e) => {
                      const value = e.target.value.replace(/[^a-zA-Z0-9]/g, '')
                      form.setFieldValue('revNo', value)
                    }}
                  />
                </Flex>
                <Flex direction="column">
                  <Text fw={600} size="lg" c="#E4E4E7">
                    FILE NAME
                  </Text>

                  <TextInput
                    placeholder="0"
                    w={186}
                    disabled={!form.values.stage7Check}
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
                    {...form.getInputProps('fileName')}
                  />
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <Flex w={'25%'} direction={'column'} rowGap={20}>
        <Stage8 />
      </Flex>
    </Flex>
  )
}

export default Stage6To8
