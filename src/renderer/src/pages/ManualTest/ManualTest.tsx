import { Flex, Tabs, Text } from '@mantine/core'
import { useState } from 'react'
import Manual from './Components/Manual'
import Input from './Components/Input'
import Output from './Components/Output'

const ManualTest = () => {
  const [activeTab, setActiveTab] = useState<string | null>('manual')
  return (
    <Tabs value={activeTab} onChange={setActiveTab} color="#F27B48">
      <Tabs.List>
        <Tabs.Tab value="manual">
          <Text size="24px" fw={600} c={activeTab === 'manual' ? '#F27B48' : '#A1A1A1'}>
            MANUAL
          </Text>
        </Tabs.Tab>
        <Tabs.Tab value="input">
          <Text size="24px" fw={600} c={activeTab === 'input' ? '#F27B48' : '#A1A1A1'}>
            INPUT
          </Text>
        </Tabs.Tab>
        <Tabs.Tab value="output">
          <Text size="24px" fw={600} c={activeTab === 'output' ? '#F27B48' : '#A1A1A1'}>
            OUTPUT
          </Text>
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value="manual">
        <Flex w={'100%'} direction="column">
          <Manual />
        </Flex>
      </Tabs.Panel>
      <Tabs.Panel value="input">
        <Input />
      </Tabs.Panel>
      <Tabs.Panel value="output">
        <Output />
      </Tabs.Panel>
    </Tabs>
  )
}

export default ManualTest
