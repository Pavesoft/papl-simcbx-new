import { Flex, rem } from '@mantine/core'

type IndicatorBarProps = { status: boolean }

const IndicatorBar = ({ status }: IndicatorBarProps) => {
  return (
    <Flex
      w={'100%'}
      style={{
        height: rem(10),
        borderRadius: rem(20),
        background: status ? '#F27B48' : '#3F333E'
      }}
    />
  )
}

export default IndicatorBar
