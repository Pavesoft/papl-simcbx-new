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
  stage4Load?: number
  stage5Load?: number
}

// Utility to normalize unknown array to number[]
const normalizePlcArray = (arr: unknown): number[] => {
  if (!Array.isArray(arr)) return []
  return arr
    .map((val) => {
      const num = Number(val)
      return isNaN(num) ? null : num
    })
    .filter((val): val is number => val !== null)
}

interface DisplacementGraphProps {
  isCollapsed: boolean
  setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>
}

const DisplacementGraph = ({ isCollapsed, setIsCollapsed }: DisplacementGraphProps) => {
  const { allItemsPlc } = useGlobalContext()

  // Get Stage 4 Displacement and Load
  const stage4_Displacement = convertPlcWordsToIntArray(allItemsPlc['R1000,500'])
  const stage4_Load = normalizePlcArray(allItemsPlc['R1500,250'])

  // Get Stage 5 Displacement and Load
  const stage5_Displacement = convertPlcWordsToIntArray(allItemsPlc['R2000,500'])
  const stage5_Load = normalizePlcArray(allItemsPlc['R2500,250'])

  // Merge both stages into a single chart dataset
  const maxLength = Math.max(stage4_Displacement.length, stage5_Displacement.length)
  const chartData: GraphPoint[] = []

  for (let i = 0; i < maxLength; i++) {
    const rawDisplacement = stage4_Displacement[i] ?? stage5_Displacement[i] ?? 0

    chartData.push({
      displacement: rawDisplacement / 1000, // divide displacement by 1000
      stage4Load: stage4_Load[i] !== undefined ? stage4_Load[i] / 100 : undefined,
      stage5Load: stage5_Load[i] !== undefined ? stage5_Load[i] / 100 : undefined
    })
  }

  // Optional: sort by displacement
  chartData.sort((a, b) => a.displacement - b.displacement)

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
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="displacement"
                type="number"
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
                type="monotone"
                dataKey="stage4Load"
                name="Stage 4 Load"
                stroke="#8884d8"
                dot={false}
                isAnimationActive={false} // 👈 Disable animation
              />
              <Line
                type="monotone"
                dataKey="stage5Load"
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
