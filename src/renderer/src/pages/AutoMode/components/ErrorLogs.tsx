import { Flex, Stack } from '@mantine/core'
import { HeadingMediumSemiBold } from '../../../components/AllText/Text'
import { useGlobalContext } from '../../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { ERROR_CODES } from '../../../shared/Constants/general.const'
import { useEffect, useState } from 'react'

const getBitArray = (value: number): number[] =>
  Array.from({ length: 16 }, (_, i) => (value >> i) & 1) // ✅ MSB = index 15, LSB = index 0

const ErrorLogs = () => {
  const { readValueFromPlc } = useGlobalContext()
  const [activeErrors, setActiveErrors] = useState<{ id: number; message: string }[]>([])

  useEffect(() => {
    const readAllBits = () => {
      const active: { id: number; message: string }[] = []

      for (let d = 900; d <= 909; d++) {
        const word = readValueFromPlc(`D${d}`) as number
        const bits = getBitArray(word)

        // Filter errors by bit
        bits.forEach((bitVal, index) => {
          if (bitVal === 1) {
            const bitId = `D${d}.${index}`

            const error = ERROR_CODES.find((e) => e.bit === bitId)
            if (error) active.push(error)
          }
        })
      }

      setActiveErrors(active)
    }

    readAllBits()
  }, [readValueFromPlc])

  return (
    <Flex direction="column" gap="sm">
      <Stack>
        {activeErrors.length === 0 ? (
          <HeadingMediumSemiBold color="#00BC7D">NO ACTIVE ERRORS</HeadingMediumSemiBold>
        ) : (
          activeErrors.map((err) => (
            <HeadingMediumSemiBold key={err.id} color="#FB2C36">
              • {err.message}
            </HeadingMediumSemiBold>
          ))
        )}
      </Stack>
    </Flex>
  )
}

export default ErrorLogs
