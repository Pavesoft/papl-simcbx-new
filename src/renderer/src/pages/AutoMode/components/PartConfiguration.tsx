import { Flex, Text } from '@mantine/core'
import { HeadingSmallMedium, HeadingMediumSemiBold } from '../../../components/AllText/Text'
import type { ModelSetting } from '@prisma/client'

const PartConfiguration = (selectedModel: ModelSetting) => {
  return (
    <Flex direction={'column'} w={'100%'}>
      <Flex bg="#262626" w={'100%'} style={{ borderRadius: '8px 8px 0px 0px' }}>
        <Text size="24px" fw={600} c="#F0E9F1" pl={16} pt={4} pb={4}>
          PART CONFIGURATION
        </Text>
      </Flex>
      <Flex
        style={{ borderRadius: '0px 0px 8px 8px' }}
        bg="#171717"
        w={'100%'}
        // direction="column"
        columnGap={26}
        p={16}
        h={112}
      >
        <Flex columnGap={18}>
          <Flex align="center" mt={16}>
            <Text fw={600} size="xl" c="#E4E4E7">
              CB1
            </Text>
          </Flex>
          <Flex justify="flex-end" columnGap={16}>
            <Flex direction="column">
              <HeadingSmallMedium>MIN</HeadingSmallMedium>
              <Flex
                w={95}
                h={36}
                bg="#262626"
                justify="center"
                align="center"
                style={{ borderRadius: '4px' }}
              >
                <HeadingMediumSemiBold>
                  {Object.keys(selectedModel).length
                    ? String(selectedModel.s4Cb1BrushPartialLoadMin)
                    : '0'}
                </HeadingMediumSemiBold>
              </Flex>
              <Text size="lg">NEWTON</Text>
            </Flex>
            <Flex direction="column">
              <HeadingSmallMedium>MAX</HeadingSmallMedium>
              <Flex
                w={95}
                h={36}
                bg="#262626"
                justify="center"
                align="center"
                style={{ borderRadius: '4px' }}
              >
                <HeadingMediumSemiBold>
                  {Object.keys(selectedModel).length
                    ? String(selectedModel.s4Cb1BrushPartialLoadMax)
                    : '0'}
                </HeadingMediumSemiBold>
              </Flex>
              <Text size="lg">NEWTON</Text>
            </Flex>
          </Flex>
        </Flex>
        <Flex columnGap={18}>
          <Flex align="center" mt={16}>
            <Text fw={600} size="xl" c="#E4E4E7">
              CB2
            </Text>
          </Flex>
          <Flex justify="flex-end" columnGap={16}>
            <Flex direction="column">
              <HeadingSmallMedium>MIN</HeadingSmallMedium>
              <Flex
                w={95}
                h={36}
                bg="#262626"
                justify="center"
                align="center"
                style={{ borderRadius: '4px' }}
              >
                <HeadingMediumSemiBold>
                  {Object.keys(selectedModel).length
                    ? String(selectedModel.s5Cb2BrushPartialLoadMin)
                    : '0'}
                </HeadingMediumSemiBold>
              </Flex>
              <Text size="lg">NEWTON</Text>
            </Flex>
            <Flex direction="column">
              <HeadingSmallMedium>MAX</HeadingSmallMedium>
              <Flex
                w={95}
                h={36}
                bg="#262626"
                justify="center"
                align="center"
                style={{ borderRadius: '4px' }}
              >
                <HeadingMediumSemiBold>
                  {Object.keys(selectedModel).length
                    ? String(selectedModel.s5Cb2BrushPartialLoadMax)
                    : '0'}
                </HeadingMediumSemiBold>
              </Flex>
              <Text size="lg">NEWTON</Text>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default PartConfiguration
