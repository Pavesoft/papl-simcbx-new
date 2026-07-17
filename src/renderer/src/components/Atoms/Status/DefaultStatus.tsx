import { Flex } from '@mantine/core'

const DefaultStatus = () => {
  return (
    <Flex
      h={10}
      w={10}
      bg="linear-gradient(145deg, #2C2E2F, #404142)"
      style={{
        borderRadius: 999,
        boxShadow: `
                0px 1.25px 1.88px 0px #00000080 inset,
                0px 0.63px 0px 0px #FFFFFF4D
            `
      }}
    />
  )
}

export default DefaultStatus
