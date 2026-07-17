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
    stage1Status: statusMap[plcReader('R0') as number],
    stage2Status: statusMap[plcReader('R1') as number],
    stage2Min: String(selectedModel.resistanceMin),
    stage2Max: String(selectedModel.resistanceMax),
    stage2Resistance: String(
      convert2WordstoFloat(plcReader('R2') as number, plcReader('R3') as number)
    ),
    stage3Status: statusMap[plcReader('R4') as number],
    stage3Impedance: String(
      convert2WordstoFloat(plcReader('R5') as number, plcReader('R6') as number)
    ),
    stage3Min: String(selectedModel.impedanceMin),
    stage3Max: String(selectedModel.impedanceMax),
    stage4Status: statusMap[plcReader('R7') as number],
    stage4Cb1PartialLoad: bigDecimalDivide(plcReader('R8') ?? 0, 100),
    stage4Cb1PartialLoadMin: String(selectedModel.s4Cb1BrushPartialLoadMin),
    stage4Cb1PartialLoadMax: String(selectedModel.s4Cb1BrushPartialLoadMax),
    stage4Cb1FullLoad: bigDecimalDivide(plcReader('R9') ?? 0, 100),
    stage4Cb1FullLoadMin: String(selectedModel.s4Cb1BrushFullLoadMin),
    stage4Cb1FullLoadMax: String(selectedModel.s4Cb1BrushFullLoadMax),
    stage5Status: statusMap[plcReader('R10') as number],
    stage5Cb2PartialLoad: bigDecimalDivide(plcReader('R12') ?? 0, 100),
    stage5Cb2PartialLoadMin: String(selectedModel.s5Cb2BrushPartialLoadMin),
    stage5Cb2PartialLoadMax: String(selectedModel.s5Cb2BrushPartialLoadMax),
    stage5Cb2FullLoad: bigDecimalDivide(plcReader('R13') ?? 0, 100),
    stage5Cb2FullLoadMin: String(selectedModel.s5Cb2BrushFullLoadMin),
    stage5Cb2FullLoadMax: String(selectedModel.s5Cb2BrushFullLoadMax),
    stage5Bop1Status: statusMap[plcReader('R11') as number],
    stage6Bop2Status: statusMap[plcReader('R14') as number],
    stage6BearingHeightStatus: statusMap[plcReader('R15') as number],
    barcode: barCode,
    stage7Status: statusMap[plcReader('R16') as number],
    stage8ScanResult: barCode,
    stage8Status: statusMap[plcReader('R17') as number],
    result: statusMap[plcReader('R18') as number]
  }

  try {
    await unwrap(api.partData.create(payload))
    plcWriter([{ address: 'M1923', value: true }]) // Success bit
  } catch (err) {
    console.error(err)
    plcWriter([{ address: 'M1924', value: true }]) // Error bit
  }
}
