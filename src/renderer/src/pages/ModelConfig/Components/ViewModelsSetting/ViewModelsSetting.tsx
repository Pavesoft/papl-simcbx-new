import { ActionIcon, Button, Flex, Tabs, Text, Title } from '@mantine/core'
import { useState } from 'react'
import Stage1To5 from './Tabs/Stage1To5'
import Stage6To8 from './Tabs/Stage6To8'
import { useViewModelContext, ViewModelContextProvider } from './ViewModelContextProvider'
import { useNavigate } from 'react-router-dom'
import { IconArrowLeft } from '@tabler/icons-react'

const ViewModelContainer = () => {
  const { handleSave } = useViewModelContext()

  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<string | null>('stage1-5')
  return (
    <Flex p={24} direction="column" bg="#0a0a0a">
      <Flex direction="row" justify="space-between">
        <Flex align="center" columnGap={4}>
          <ActionIcon variant="transparent" onClick={() => navigate('/model-config')}>
            <IconArrowLeft size={24} color="#F7F2F8" />
          </ActionIcon>
          <Title order={2}>MODEL DETAILS</Title>
        </Flex>

        <Flex columnGap={8}>
          <Button
            // variant="outline"
            variant="gradient"
            gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
            style={{ border: '1px solid #525252' }}
            onClick={() => {
              navigate('/model-config')
            }}
          >
            <Text size="xl" fw={600} c="#E5E5E5">
              CANCEL
            </Text>
          </Button>
          <Button
            variant="gradient"
            gradient={{ from: '#F27B48', to: '#B4522E', deg: 180 }}
            onClick={handleSave}
          >
            <Text size="xl" fw={600} c="#E5E5E5">
              SAVE
            </Text>
          </Button>
        </Flex>
      </Flex>
      <Flex direction="column">
        <Tabs value={activeTab} onChange={setActiveTab} color="#F27B48">
          <Tabs.List>
            <Tabs.Tab value="stage1-5">
              <Text size="24px" fw={600} c={activeTab === 'stage1-5' ? '#F27B48' : '#A1A1A1'}>
                STAGE 1 - 5
              </Text>
            </Tabs.Tab>
            <Tabs.Tab value="stage6-8">
              <Text size="24px" fw={600} c={activeTab === 'stage6-8' ? '#F27B48' : '#A1A1A1'}>
                STAGE 6 - 8
              </Text>
            </Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="stage1-5">
            <Flex w={'100%'} direction="column">
              <Stage1To5 />
            </Flex>
          </Tabs.Panel>
          <Tabs.Panel value="stage6-8">
            <Stage6To8 />
          </Tabs.Panel>
        </Tabs>
      </Flex>
    </Flex>
  )
}

const ViewModelsSetting = () => {
  return (
    <ViewModelContextProvider>
      <ViewModelContainer />
    </ViewModelContextProvider>
  )
}

export default ViewModelsSetting
