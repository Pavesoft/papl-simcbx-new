import { Checkbox, Flex, Switch, Text } from '@mantine/core'
import { useCreateModelContext } from '../CreateModelContextProvider'
import Common from './components/Common'
import Stage2 from './components/Stage2'
import Stage3 from './components/Stage3'
import Stage4 from './components/Stage4'
import Stage5 from './components/Stage5'

const Stage1To5 = () => {
  const { form } = useCreateModelContext()

  return (
    <Flex h={'calc(90vh - 50px)'} columnGap={20} mt={12}>
      <Flex w={'25%'} direction={'column'} rowGap={20}>
        <Common />
        <Flex direction={'column'}>
          <Flex
            bg="#262626"
            w={'100%'}
            style={{ borderRadius: '8px 8px 0px 0px' }}
            align={'center'}
            pl={16}
          >
            <Switch size="sm" {...form.getInputProps('stage1Check', { type: 'checkbox' })} />
            <Text size="24px" fw={600} c="#F0E9F1" pl={10} pt={4} pb={4}>
              STAGE 1
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
            <Checkbox
              size="md"
              disabled={!form.values.stage1Check}
              label={
                <Text fw={600} size="lg" c="#E4E4E7">
                  PART PRESENT
                </Text>
              }
              {...form.getInputProps('partPresent', { type: 'checkbox' })}
            />
          </Flex>
        </Flex>
      </Flex>
      <Flex w={'25%'} direction={'column'} rowGap={20}>
        <Stage2 />
        <Stage3 />
      </Flex>
      <Flex w={'25%'} direction={'column'} rowGap={20}>
        <Stage4 />
      </Flex>
      <Flex w={'25%'} direction={'column'} rowGap={20}>
        <Stage5 />
      </Flex>
    </Flex>
  )
}

export default Stage1To5
