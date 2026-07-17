import type { FC } from 'react'
import { HeadingMediumSemiBold } from '../../../components/AllText/Text'
import { useAutoContext } from '../context'
import { Flex } from '@mantine/core'

export const BarcodeScanResult: FC = () => {
  const { barcodeScanResult } = useAutoContext()

  return barcodeScanResult ? (
    <Flex
      w={600}
      h={48}
      bg="#1B362F"
      justify="center"
      align="center"
      style={{ borderRadius: '4px' }}
    >
      <HeadingMediumSemiBold color="#FFFFFF">{`BARCODE: ${barcodeScanResult}`}</HeadingMediumSemiBold>
    </Flex>
  ) : null
}
