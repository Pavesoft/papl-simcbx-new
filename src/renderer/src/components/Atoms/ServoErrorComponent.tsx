import { Flex } from '@mantine/core'
import { useGlobalContext } from '../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { HeadingMediumSemiBold } from '../AllText/Text'

type ComponentProps = {
  label: string
  errorAddress?: string | undefined
}
const ServoErrorComponent = ({ label, errorAddress }: ComponentProps) => {
  const { readValueFromPlc } = useGlobalContext()

  const plcValue = errorAddress ? readValueFromPlc(errorAddress) : 0

  return (
    <Flex w="100%" justify="space-between" pl={16} pr={16}>
      <Flex align="center">
        <HeadingMediumSemiBold color="#F0E9F1">{label}</HeadingMediumSemiBold>
      </Flex>
      <Flex
        w={140}
        h={36}
        bg="#262626"
        justify="center"
        align="center"
        style={{ borderRadius: '4px' }}
      >
        <HeadingMediumSemiBold color="#737373">{plcValue}</HeadingMediumSemiBold>
      </Flex>
    </Flex>
  )
}

export default ServoErrorComponent
