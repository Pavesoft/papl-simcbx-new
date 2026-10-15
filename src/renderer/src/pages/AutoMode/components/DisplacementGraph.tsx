import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { Flex, Text } from '@mantine/core'
import { IconCaretUpFilled } from '@tabler/icons-react'
import { useGlobalContext } from '../../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { convertPlcWordsToIntArray } from '../../../shared/util/general.util'

// Type Definitions
interface GraphPoint {
  displacement: number
  load: number
}

// Modbus holding registers arrive as unsigned 16-bit (0..65535); convert to signed int16
const normalizePlcArray = (arr: unknown): number[] => {
  if (!Array.isArray(arr)) return []
  return arr.map((val) => {
    const num = Number(val)
    if (isNaN(num)) return 0
    const word = num & 0xffff
    return word > 0x7fff ? word - 0x10000 : word
  })
}

// Pair each displacement sample with the load sample at the same index (same stage),
// dropping the unfilled (0, 0) slots at the end of the PLC buffer
const buildStageSeries = (displacement: number[], load: number[]): GraphPoint[] => {
  const length = Math.min(displacement.length, load.length)
  let lastIndex = length - 1
  while (lastIndex >= 0 && displacement[lastIndex] === 0 && load[lastIndex] === 0) lastIndex--

  const series: GraphPoint[] = []
  for (let i = 0; i <= lastIndex; i++) {
    series.push({
      displacement: displacement[i] / 1000, // divide displacement by 1000
      load: load[i] / 100
    })
  }
  return series
}

interface DisplacementGraphProps {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const DisplacementGraph = ({ isCollapsed, setIsCollapsed }: DisplacementGraphProps) => {
  const { allItemsPlc } = useGlobalContext()

  // Get Stage 4 Displacement and Load
  const stage4_Displacement = convertPlcWordsToIntArray(allItemsPlc['D4500,500'])
  const stage4_Load = normalizePlcArray(allItemsPlc['D5000,250'])

  // Get Stage 5 Displacement and Load
  const stage5_Displacement = convertPlcWordsToIntArray(allItemsPlc['D5250,500'])
  const stage5_Load = normalizePlcArray(allItemsPlc['D5750,250'])

  // Each stage keeps its own displacement axis values; plotted in acquisition order
  const stage4Data = buildStageSeries(stage4_Displacement, stage4_Load)
  const stage5Data = buildStageSeries(stage5_Displacement, stage5_Load)

  return (
    <Flex direction="column" w="100%">
      {/* Header */}
      <Flex
        bg="#262626"
        w="100%"
        style={{ borderRadius: '8px 8px 0px 0px', cursor: 'pointer' }}
        align="center"
        justify="space-between"
        pl={16}
        pr={16}
        onClick={() => setIsCollapsed((prev) => !prev)}
      >
        <Text size="24px" fw={600} c="#F0E9F1" pt={4} pb={4}>
          DISPLACEMENT vs LOAD GRAPH
        </Text>
        <IconCaretUpFilled
          style={{
            transition: 'transform 0.3s ease',
            transform: isCollapsed ? 'rotate(180deg)' : 'rotate(0deg)',
            color: '#F0E9F1'
          }}
        />
      </Flex>

      {/* Graph */}
      {!isCollapsed && (
        <Flex
          style={{ borderRadius: '0px 0px 8px 8px' }}
          bg="#171717"
          h={300}
          justify="center"
          align="center"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="displacement"
                type="number"
                domain={['auto', 'auto']}
                allowDuplicatedCategory={false}
                label={{
                  value: 'Displacement (mm)',
                  position: 'insideBottomRight',
                  offset: -10
                }}
              />
              <YAxis
                type="number"
                label={{
                  value: 'Load (N)',
                  angle: -90,
                  position: 'insideLeft'
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                type="linear"
                data={stage4Data}
                dataKey="load"
                name="Stage 4 Load"
                stroke="#8884d8"
                dot={false}
                isAnimationActive={false} // 👈 Disable animation
              />
              <Line
                type="linear"
                data={stage5Data}
                dataKey="load"
                name="Stage 5 Load"
                stroke="#82ca9d"
                dot={false}
                isAnimationActive={false} // 👈 Disable animation
              />
            </LineChart>
          </ResponsiveContainer>
        </Flex>
      )}
    </Flex>
  )
}

export default DisplacementGraph
