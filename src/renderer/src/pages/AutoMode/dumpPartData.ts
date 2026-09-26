import type { ModelSetting, Prisma } from '@prisma/client'
import { api, unwrap } from '../../api'
import { convert2WordstoFloat } from '../../shared/util/general.util'
import { bigDecimalDivide } from '../../shared/util/bigDecimalDivide'
import { getCurrentShift } from '../../shared/Constants/general.const'

const statusMap: Record<number, string> = {
  0: 'STAGE OFF',
  1: 'OK',
  2: 'NOK',
  3: 'NA',
  4: 'MACHINE ERROR',
  5: 'PREVIOUS STAGE NOK'
}
export const dumpPartData = async (
  plcReader: (address: string) => number | boolean | null,
  plcWriter: (writes: [{ address: string; value: number | boolean }]) => void,
  barCode: string,
  selectedModel: ModelSetting
) => {
  const payload: Prisma.PartDataCreateInput = {
    date: new Date(),
    shift: getCurrentShift(new Date()),
    programNo: selectedModel.programNo,
    modelName: selectedModel.modelName,
    stage1Status: statusMap[plcReader('D7900') as number],
    stage2Status: statusMap[plcReader('D7901') as number],
    stage2Min: String(selectedModel.resistanceMin),
    stage2Max: String(selectedModel.resistanceMax),
    stage2Resistance: String(
      convert2WordstoFloat(plcReader('D7902') as number, plcReader('D7903') as number)
    ),
    stage3Status: statusMap[plcReader('D7904') as number],
    stage3Impedance: String(
      convert2WordstoFloat(plcReader('D7905') as number, plcReader('D7906') as number)
    ),
    stage3Min: String(selectedModel.impedanceMin),
    stage3Max: String(selectedModel.impedanceMax),
    stage4Status: statusMap[plcReader('D7907') as number],
    stage4Cb1PartialLoad: bigDecimalDivide(plcReader('D7908') ?? 0, 100),
    stage4Cb1PartialLoadMin: String(selectedModel.s4Cb1BrushPartialLoadMin),
    stage4Cb1PartialLoadMax: String(selectedModel.s4Cb1BrushPartialLoadMax),
    stage4Cb1FullLoad: bigDecimalDivide(plcReader('D7909') ?? 0, 100),
    stage4Cb1FullLoadMin: String(selectedModel.s4Cb1BrushFullLoadMin),
    stage4Cb1FullLoadMax: String(selectedModel.s4Cb1BrushFullLoadMax),
    stage5Status: statusMap[plcReader('D7910') as number],
    stage5Cb2PartialLoad: bigDecimalDivide(plcReader('D7912') ?? 0, 100),
    stage5Cb2PartialLoadMin: String(selectedModel.s5Cb2BrushPartialLoadMin),
    stage5Cb2PartialLoadMax: String(selectedModel.s5Cb2BrushPartialLoadMax),
    stage5Cb2FullLoad: bigDecimalDivide(plcReader('D7913') ?? 0, 100),
    stage5Cb2FullLoadMin: String(selectedModel.s5Cb2BrushFullLoadMin),
    stage5Cb2FullLoadMax: String(selectedModel.s5Cb2BrushFullLoadMax),
    stage5Bop1Status: statusMap[plcReader('D7911') as number],
    stage6Bop2Status: statusMap[plcReader('D7914') as number],
    stage6BearingHeightStatus: statusMap[plcReader('D7915') as number],
    barcode: barCode,
    stage7Status: statusMap[plcReader('D7916') as number],
    stage8ScanResult: barCode,
    stage8Status: statusMap[plcReader('D7917') as number],
    result: statusMap[plcReader('D7918') as number]
  }

  try {
    await unwrap(api.partData.create(payload))
    plcWriter([{ address: 'M1923', value: true }]) // Success bit
  } catch (err) {
    console.error(err)
    plcWriter([{ address: 'M1924', value: true }]) // Error bit
  }
}
