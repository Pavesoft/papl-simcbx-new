import { Button, Checkbox, Flex, Select, Title, type SelectProps } from '@mantine/core'
import { TitleBold } from '../../components/AllText/Text'
import { useEffect, useMemo, useState, type FC } from 'react'
import { DatePickerInput } from '@mantine/dates'
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table'
import type { PartData } from '@prisma/client'
import { api, unwrap } from '../../api'
import moment from 'moment'
import { successNotification } from '../../shared/util/successNotification'
import { errorNotification } from '../../shared/util/errorNotification'
import { SHIFTS } from '../../shared/Constants/general.const'

const Reports = () => {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [monthWiseReport, setMonthWiseReport] = useState(false)
  const [partDetails, setPartDetails] = useState<PartData[]>([])
  const [shiftFilter, setShiftFilter] = useState<string | null>(null)

  const columns = useMemo<MRT_ColumnDef<PartData>[]>(
    () => [
      {
        accessorKey: 'date', //access nested data with dot notation
        header: 'Date',
        Cell: ({ cell }) => {
          const date = new Date(cell.getValue<string>())
          return moment(date).format('DD/MM/YYYY')
        }
      },
      {
        header: 'Time',
        id: 'time', // use `id` because there's no direct field in the data
        Cell: ({ row }) => {
          const rawDate = row.original.date
          const date = rawDate ? new Date(rawDate) : null
          return moment(date).format('HH:mm:ss') // or "hh:mm A" for 12-hour format
        }
      },
      {
        accessorKey: 'shift',
        header: 'Shift'
      },
      {
        accessorKey: 'updatedBy.userName',
        header: 'Operator Name'
      },
      {
        accessorKey: 'programNo',
        header: 'Program No'
      },
      {
        accessorKey: 'modelName',
        header: 'Model Name'
      },
      {
        accessorKey: 'stage1Status',
        header: 'Stage 1 Status'
      },
      {
        accessorKey: 'stage2Resistance',
        header: 'STAGE-2 Resistance Act(mOhm)'
      },
      {
        accessorKey: 'stage2Min',
        header: 'STAGE-2 Resistance Min(mOhm)'
      },
      {
        accessorKey: 'stage2Max',
        header: 'STAGE-2 Resistance Max(mOhm)'
      },
      {
        accessorKey: 'stage3Status',
        header: 'STAGE-3 Status'
      },
      {
        accessorKey: 'stage3Min',
        header: 'STAGE-3 Impedance Min(microF)'
      },
      {
        accessorKey: 'stage3Impedance',
        header: 'STAGE-3 Impedance Act(microF)'
      },
      {
        accessorKey: 'stage3Max',
        header: 'STAGE-3 Impedance Max(microF)'
      },
      {
        accessorKey: 'stage4Status',
        header: 'Stage 4 Status'
      },
      {
        accessorKey: 'stage4Cb1PartialLoadMin',
        header: 'STAGE-4 CB1 PARTIAL PRESS LOAD Min(N)'
      },
      {
        accessorKey: 'stage4Cb1PartialLoad',
        header: 'STAGE-4 CB1 PARTIAL PRESS LOAD Act(N)'
      },
      {
        accessorKey: 'stage4Cb1PartialLoadMax',
        header: 'STAGE-4 CB1 PARTIAL PRESS LOAD Max(N)'
      },
      {
        accessorKey: 'stage4Cb1FullLoadMin',
        header: 'STAGE-4 CB1 FULL PRESS LOAD Min(N)'
      },
      {
        accessorKey: 'stage4Cb1FullLoad',
        header: 'STAGE-4 CB1 FULL PRESS LOAD Act(N)'
      },
      {
        accessorKey: 'stage4Cb1FullLoadMax',
        header: 'STAGE-4 CB1 FULL PRESS LOAD Max(N)'
      },
      {
        accessorKey: 'stage5Status',
        header: 'Stage 5 Status'
      },
      {
        accessorKey: 'stage5Bop1Status',
        header: 'Stage 5 BOP1 Status'
      },
      {
        accessorKey: 'stage5Cb2PartialLoadMin',
        header: 'STAGE-5 CB2 PARTIAL PRESS LOAD Min(N)'
      },
      {
        accessorKey: 'stage5Cb2PartialLoad',
        header: 'STAGE-5 CB2 PARTIAL PRESS LOAD Act(N)'
      },
      {
        accessorKey: 'stage5Cb2PartialLoadMax',
        header: 'STAGE-5 CB2 PARTIAL PRESS LOAD Max(N)'
      },
      {
        accessorKey: 'stage5Cb2FullLoadMin',
        header: 'STAGE-5 CB2 FULL PRESS LOAD Min(N)'
      },
      {
        accessorKey: 'stage5Cb2FullLoad',
        header: 'STAGE-5 CB2 FULL PRESS LOAD Act(N)'
      },
      {
        accessorKey: 'stage5Cb2FullLoadMax',
        header: 'STAGE-5 CB2 FULL PRESS LOAD Max(N)'
      },

      {
        accessorKey: 'stage6Bop2Status',
        header: 'Stage 6 BOP2 Status'
      },
      {
        accessorKey: 'stage6BearingHeightStatus',
        header: 'Stage 6 Bearing Height Status'
      },
      {
        accessorKey: 'barcode',
        header: 'Barcode'
      },
      {
        accessorKey: 'stage7Status',
        header: 'Stage 7 Status'
      },
      {
        accessorKey: 'stage8Status',
        header: 'Stage 8 Status'
      },
      {
        accessorKey: 'result',
        header: 'Final Result'
      }
    ],
    []
  )

  const table = useMantineReactTable({
    columns,
    data: partDetails, //must be memoized or stable (useState, useMemo, defined outside of this component, etc.)
    enableRowNumbers: true
  })

  const handleExport = async () => {
    if (!startDate || !endDate) {
      throw new Error('Both startDate and endDate must be selected.')
    }
    const params: { startDate: Date; endDate: Date; shift: string | undefined } = {
      startDate: moment(startDate).startOf('day').toDate(),
      endDate: moment(endDate).endOf('day').toDate(),
      shift: shiftFilter ?? undefined
    }

    const res = await unwrap(api.partData.exportToExcel(params))
    if (res) {
      successNotification({ title: 'Download complete', message: res.filePath })
    } else {
      errorNotification({ title: 'Download failed', message: 'Something went wrong' })
    }
  }
  const handleGenerateReport = () => {
    const queryParams: { startDate?: Date; endDate?: Date } = {}
    if (startDate) queryParams.startDate = new Date(startDate)
    if (endDate) queryParams.endDate = new Date(endDate)

    unwrap(
      api.partData.list({
        startDate: moment(startDate).startOf('day').toDate(),
        endDate: moment(endDate).endOf('day').toDate(),
        shift: shiftFilter ?? undefined
      })
    ).then(setPartDetails)
  }

  useEffect(() => {
    if (monthWiseReport && startDate) {
      const start = new Date(startDate)
      const today = new Date()

      const startYear = start.getFullYear()
      const startMonth = start.getMonth()

      let end: Date

      // If selected month is current month, set endDate as today
      if (startYear === today.getFullYear() && startMonth === today.getMonth()) {
        end = today
      } else {
        // Else, set endDate as last day of that month
        end = new Date(startYear, startMonth + 1, 0) // 0th of next month = last day of this month
      }

      setEndDate(end)
    }
  }, [monthWiseReport, startDate])

  return (
    <Flex direction="column" p={24} w={'100%'} h={'96vh'}>
      <Title order={2}>Reports</Title>
      <Flex w={'100%'} align={'flex-end'} justify={'space-between'}>
        <Flex columnGap={8} align={'flex-end'}>
          <DatePickerInput
            w={320}
            label="START DATE"
            placeholder="Pick date"
            maxDate={new Date()}
            value={startDate}
            onChange={(date) => setStartDate(date ? new Date(date) : null)}
          />
          <DatePickerInput
            w={320}
            label="END DATE"
            placeholder="Pick date"
            value={endDate}
            maxDate={new Date()}
            onChange={(value) => setEndDate(value ? new Date(value) : null)}
            disabled={monthWiseReport}
          />
          <Checkbox
            ml={16}
            disabled={!startDate}
            size="md"
            label="MONTH WISE REPORT"
            checked={monthWiseReport}
            onChange={(e) => setMonthWiseReport(e.currentTarget.checked)}
          />
          <ShiftSelect
            value={shiftFilter}
            onChange={(value) => {
              setShiftFilter(value)
            }}
          />
        </Flex>
        <Flex columnGap={16}>
          <Button
            variant="gradient"
            gradient={{ from: '#F27B48', to: '#B4522E', deg: 180 }}
            disabled={!startDate || !endDate}
            onClick={() => {
              handleGenerateReport()
            }}
          >
            GENERATE REPORT
          </Button>
          <Button
            variant="gradient"
            gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
            disabled={!(partDetails.length > 0)}
            onClick={handleExport}
          >
            EXPORT TO EXCEL
          </Button>
        </Flex>
      </Flex>
      <Flex w={'100%'} mt={32}>
        <MantineReactTable table={table} />
      </Flex>
    </Flex>
  )
}

export default Reports

const ShiftSelect: FC<SelectProps> = ({ ...props }) => {
  const shifts = Object.keys(SHIFTS)
  return (
    <Select
      ml={'md'}
      label="SHIFT"
      placeholder="Select Shift"
      size="sm"
      data={shifts.map((shift) => ({ value: shift, label: shift }))}
      {...props}
    />
  )
}
