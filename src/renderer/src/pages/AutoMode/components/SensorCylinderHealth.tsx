import { Divider, Flex, Indicator, ScrollArea, Text } from '@mantine/core'
import { HeadingMediumSemiBold, HeadingSmallSemiBold } from '../../../components/AllText/Text'
import { useGlobalContext } from '../../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'

// Constants
const HEALTH_CONFIG = {
  colors: {
    0: '#262626', // Gray
    1: '#525252', // Slightly lighter gray
    2: '#00FFB0', // Green
    3: '#FF000C' // Red
  },
  animations: {
    0: false,
    1: false,
    2: true,
    3: true
  },
  textColors: {
    0: '#3F3F47', // Gray
    1: '#E4E4E7', // Slightly lighter gray
    2: '#E4E4E7', // Slightly lighter gray
    3: '#E4E4E7' // Slightly lighter gray
  }
}

const SECTION_WIDTH = 161
const COLUMN_GAP = 20
const ROW_GAP = 12

// Types
type SensorItem = {
  bit: string
  label: string
}

type SensorSection = {
  title: string
  items: SensorItem[]
  layout?: 'row' | 'grid' // 'grid' will wrap items in multiple rows if needed
}

const SensorCylinderHealth = ({ isCollapsed }) => {
  const { readValueFromPlc } = useGlobalContext()

  const getHealthStatus = (bit: string) => {
    const value = Number(readValueFromPlc(bit))
    return {
      color: HEALTH_CONFIG.colors[value as keyof typeof HEALTH_CONFIG.colors],
      isAnimated: HEALTH_CONFIG.animations[value as keyof typeof HEALTH_CONFIG.animations],
      textColor:
        HEALTH_CONFIG.textColors[value as keyof typeof HEALTH_CONFIG.textColors] ||
        HEALTH_CONFIG.textColors[0]
    }
  }

  const renderSensorItem = ({ bit, label }: SensorItem) => {
    const { color, isAnimated, textColor } = getHealthStatus(bit)
    return (
      <Flex key={bit} align="center" columnGap={12} w={SECTION_WIDTH}>
        <Indicator color={color} size={12} processing={isAnimated} />
        <HeadingSmallSemiBold color={textColor}>{label}</HeadingSmallSemiBold>
      </Flex>
    )
  }

  const renderSection = ({ items, layout = 'row' }: SensorSection) => {
    if (layout === 'row') {
      return (
        <Flex align="center" columnGap={COLUMN_GAP} pl={6}>
          {items.map(renderSensorItem)}
        </Flex>
      )
    }

    // Grid layout (for sections with multiple rows)
    return (
      <Flex direction="column" rowGap={ROW_GAP}>
        {chunkArray(items, 3).map((rowItems, rowIndex) => (
          <Flex key={rowIndex} align="center" columnGap={COLUMN_GAP} pl={6}>
            {rowItems.map(renderSensorItem)}
          </Flex>
        ))}
      </Flex>
    )
  }

  // Helper function to split array into chunks
  const chunkArray = <T,>(array: T[], size: number): T[][] => {
    const result: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size))
    }
    return result
  }

  // Configuration for all sections
  const sections: SensorSection[] = [
    {
      title: 'STAGE 1',
      items: [{ bit: 'D600', label: 'PART PRESENCE' }]
    },
    {
      title: 'STAGE 2',
      items: [
        { bit: 'D602', label: 'PROBE CYL1' },
        { bit: 'D603', label: 'PROBE CYL2' },
        { bit: 'D604', label: 'RESISTANCE' }
      ]
    },
    {
      title: 'STAGE 3',
      items: [
        { bit: 'D606', label: 'PROBE CYL1' },
        { bit: 'D607', label: 'PROBE CYL2' },
        { bit: 'D608', label: 'IMPEDANCE' }
      ]
    },
    {
      title: 'STAGE 4',
      items: [
        { bit: 'D609', label: 'CLAMP' },
        { bit: 'D610', label: 'LOAD CELL CYL' },
        { bit: 'D611', label: 'LOAD' },
        { bit: 'D612', label: 'CB1 PRESS' },
        { bit: 'D613', label: 'SERVO POS 1' },
        { bit: 'D614', label: 'SERVO POS 2' }
      ],
      layout: 'grid'
    },
    {
      title: 'SERVO HOME',
      items: [{ bit: 'D615', label: 'SERVO HOME' }]
    },
    {
      title: 'STAGE 5',
      items: [
        { bit: 'D617', label: 'CLAMP STATUS' },
        { bit: 'D618', label: 'LOAD CELL CYL' },
        { bit: 'D619', label: 'LOAD' },
        { bit: 'D620', label: 'CB1 PRESS' },
        { bit: 'D621', label: 'SERVO POS 1' },
        { bit: 'D622', label: 'SERVO POS 2' }
      ],
      layout: 'grid'
    },
    {
      title: 'SERVO HOME s5',
      items: [{ bit: 'D623', label: 'SERVO HOME' }]
    },
    {
      title: 'STAGE 6',
      items: [
        { bit: 'D628', label: 'BEARING PROBE' },
        { bit: 'D629', label: 'BEARING' }
      ]
    },
    {
      title: 'STAGE 7',
      items: [{ bit: 'D631', label: 'DPM MARKING' }]
    },
    {
      title: 'STAGE 8',
      items: [
        { bit: 'D633', label: 'SERVO PICK POS' },
        { bit: 'D634', label: 'SERVO PLACE POS' },
        { bit: 'D635', label: 'SERVO HOME POS' },
        { bit: 'D641', label: 'PART PICK UP/DN' },
        { bit: 'D642', label: 'PART GRIP CYL' },
        { bit: 'D643', label: 'SCANNER STATUS' }
      ],
      layout: 'grid'
    },
    {
      title: 'HOME STATUS',
      items: [
        { bit: 'D650', label: 'HOME ERROR' },
        { bit: 'D651', label: 'STAGE 1 HOME' },
        { bit: 'D652', label: 'STAGE 2 HOME' },
        { bit: 'D653', label: 'STAGE 3 HOME' },
        { bit: 'D654', label: 'STAGE 4 HOME' },
        { bit: 'D655', label: 'STAGE 5 HOME' },
        { bit: 'D656', label: 'STAGE 6 HOME' },
        { bit: 'D657', label: 'STAGE 7 HOME' },
        { bit: 'D658', label: 'STAGE 8 HOME' },
        { bit: 'D659', label: 'INDEXER' }
      ],
      layout: 'grid'
    }
  ]

  return (
    <Flex direction="column" w="100%">
      <Flex bg="#262626" w="100%" style={{ borderRadius: '8px 8px 0px 0px' }}>
        <Text size="24px" fw={600} c="#F0E9F1" pl={16} py={4}>
          SENSOR/CYLINDER HEALTH
        </Text>
      </Flex>
      <ScrollArea
        // mah={556}
        mah={isCollapsed ? 500 : 200}
      >
        <Flex
          style={{ borderRadius: '0px 0px 8px 8px' }}
          bg="#171717"
          w="100%"
          direction="column"
          rowGap={16}
          py={16}
        >
          {sections.map((section, index) => (
            <div key={section.title}>
              <Flex direction="column" pl={16} rowGap={ROW_GAP}>
                <HeadingMediumSemiBold>{section.title}</HeadingMediumSemiBold>
                {renderSection(section)}
              </Flex>
              {index < sections.length - 1 && <Divider c="#404040" mt={8} />}
            </div>
          ))}
        </Flex>
      </ScrollArea>
    </Flex>
  )
}

export default SensorCylinderHealth
