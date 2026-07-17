import { Flex } from '@mantine/core'

const SucessStatus = () => {
  return (
    <Flex
      h={10}
      w={10}
      bg="#00C950"
      style={{
        borderRadius: 999,
        boxShadow: `
                  0px 1.88px 0.63px 0px #FFFFFFB2 inset,
                  0px 1.25px 1.25px 0px #0000004D
              `
      }}
    />
  )
}

export default SucessStatus
