import { Button, Flex } from '@mantine/core'
import { HeadingMediumSemiBold, HeadingSmallMedium } from '../../../components/AllText/Text'
import { useGlobalContext } from '../../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { IconRestore } from '@tabler/icons-react'

const statusItems = [
  { label: 'TESTED', address: 'D520' },
  { label: 'PASSED', address: 'D522' },
  { label: 'FAILED', address: 'D524' },
  { label: 'RESISTANCE', address: 'D526' },
  { label: 'IMPEDANCE', address: 'D528' },
  { label: 'CB1', address: 'D530' },
  { label: 'CB2', address: 'D532' },
  { label: 'BOP', address: 'D534' },
  { label: 'MARKING', address: 'D536' },
  { label: 'SCANNING', address: 'D538' }
]

const boxStyle = {
  width: 82,
  height: 36,
  backgroundColor: '#262626',
  borderRadius: '4px'
}

const BottomStatus = () => {
  const { readValueFromPlc, writeMultipleValuesToPlc, userDetails } = useGlobalContext()

  return (
    <Flex columnGap={16} align="flex-end">
      {statusItems.map(({ label, address }) => (
        <Flex key={address} direction="column">
          <HeadingSmallMedium>{label}</HeadingSmallMedium>
          <Flex style={boxStyle} justify="center" align="center">
            <HeadingMediumSemiBold>{readValueFromPlc(address)}</HeadingMediumSemiBold>
          </Flex>
        </Flex>
      ))}
      <Button
        variant="gradient"
        gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
        style={{ border: '1px solid #525252' }}
        leftSection={<IconRestore />}
        onClick={() => writeMultipleValuesToPlc([{ address: 'M1908', value: true }])}
        disabled={!userDetails?.cycleReset}
        size="md"
      >
        COUNT RESET
      </Button>
    </Flex>
  )
}

export default BottomStatus
