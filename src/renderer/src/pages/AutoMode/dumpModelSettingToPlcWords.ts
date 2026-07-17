// Extend ModelSetting to include partPlacePOS1

import type { ModelSetting } from '@prisma/client'
import { convertFloatToWord, convertIntToWord } from '../../shared/util/general.util'
import { bigDecimalMultiply } from '../../shared/util/bigDecimalMultiply'

export type PlcWords = {
  [
    key in
      | 'D700'
      | 'D701'
      | 'D702'
      | 'D703'
      | 'D704'
      | 'D705'
      | 'D706'
      | 'D707'
      | 'D708'
      | 'D730'
      | 'D731'
      | 'D732'
      | 'D733'
      | 'D734'
      | 'D735'
      | 'D750'
      | 'D751'
      | 'D752'
      | 'D753'
      | 'D754'
      | 'D755'
      | 'D770'
      | 'D771'
      | 'D772'
      | 'D773'
      | 'D774'
      | 'D775'
      | 'D776'
      | 'D777'
      | 'D778'
      | 'D779'
      | 'D780'
      | 'D781'
      | 'D782'
      | 'D783'
      | 'D790'
      | 'D791'
      | 'D792'
      | 'D793'
      | 'D794'
      | 'D795'
      | 'D796'
      | 'D797'
      | 'D798'
      | 'D799'
      | 'D800'
      | 'D801'
      | 'D802'
      | 'D803'
      | 'D804'
      | 'D810'
      | 'D811'
      | 'D812'
      | 'D860'
      | 'D861'
      | 'D862'
      | 'D863'
      | 'D864'
      | 'D865'
      | 'D866'
      | 'D867'
      | 'D868'
      | 'D869'
      | 'D870'
      | 'D872'
      | 'D873'
      | 'D874'
      | 'D875'
      | 'D876'
      | 'D877'
      | 'D878'
      | 'D879'
  ]: number
}

type WordMap = (keyof ModelSetting | null)[]

// === 1. Define D700 to D708 bit mappings ===

const D700_MAP: WordMap = [
  'rejectionBin', // D700.0
  'lightCurtain', // D700.1
  'doorLimitSwitch', // D700.2
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null // D700.15
]

const D701_MAP: WordMap = [
  'stage1Check', // D701.0
  'partPresent', // D701.1
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null // D701.15
]

const D702_MAP: WordMap = [
  'stage2Check', // D702.0
  's2ProbeCyl1', // D702.1
  's2PC1Forward', // D702.2
  null, // D702.3
  's2ProbeCyl2', // D702.4
  's2PC2Forward', // D702.5
  null, // D702.6
  'resistance', // D702.7
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
]

const D703_MAP: WordMap = [
  'stage3Check', // D703.0
  'S3ProbeCyl1', // D703.1
  'S3PC1Forward', // D703.2
  null, // D703.3
  'S3ProbeCyl2', // D703.4
  'S3PC2Forward', // D703.5
  null, // D703.6
  'impedance', // D703.7
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
]

const D704_MAP: WordMap = [
  'stage4Check', // D704.0
  's4Clamp', // D704.1
  's4ClampForward', // D704.2
  null, // D704.3
  's4LoadCellCyl', // D704.4
  's4LoadCellCylForward', // D704.5
  null, // D704.6
  's4CbLoad', // D704.7
  's4CbPressingLoad', // D704.8
  null,
  null,
  null,
  null,
  null,
  null,
  null
]

const D705_MAP: WordMap = [
  'stage5Check', // D705.0
  's5Clamp', // D705.1
  's5ClampForward', // D705.2
  null, // D705.3
  's5LoadCellCyl', // D705.4
  's5LoadCellCylForward', // D705.5
  null, // D705.6
  's5CbLoad', // D705.7
  's5CbPressingLoad', // D705.8
  's5BopCheck', // D705.9
  's5CbLoadComparison', // D705.10
  null,
  null,
  null,
  null,
  null
]

const D706_MAP: WordMap = [
  'stage6Check', // D706.0
  'S6BearingCyl', // D706.1
  'S6BearingCylForward', // D706.2
  null, // D706.3
  's6BopCheck', // D706.4
  'bearingAngleCheck', // D706.5
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
]

const D707_MAP: WordMap = [
  'stage7Check', // D707.0
  'markingCheck', // D707.1
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
]

const D708_MAP: WordMap = [
  'stage8Check', // D708.0
  'upDownCylCheck', // D708.1
  'upDownCylUp', // D708.2
  null, // D708.3
  'gripperCheck', // D708.4
  'gripperGrip', // D708.5
  null, // D708.6
  'scanCheck', // D708.7
  null,
  null,
  null,
  null,
  null,
  null,
  null,
  null
]

// === 2. Create 16-bit word from booleans ===

function createWordFromBools(mapping: WordMap, model: ModelSetting | null | undefined): number {
  let word = 0
  if (!model) return word
  mapping.forEach((field, index) => {
    if (field && model[field]) {
      word |= 1 << index
    }
  })
  return word
}

// === 3. Main Dump Function ===

export const dumpModelSettingToPlcWords = (model: ModelSetting): PlcWords => {
  const bitWords = {
    D700: createWordFromBools(D700_MAP, model),
    D701: createWordFromBools(D701_MAP, model),
    D702: createWordFromBools(D702_MAP, model),
    D703: createWordFromBools(D703_MAP, model),
    D704: createWordFromBools(D704_MAP, model),
    D705: createWordFromBools(D705_MAP, model),
    D706: createWordFromBools(D706_MAP, model),
    D707: createWordFromBools(D707_MAP, model),
    D708: createWordFromBools(D708_MAP, model)
  }

  // === DATA-WORDS ===
  const dataWords: Record<string, number> = {}

  // ---- Stage 2 ----
  dataWords['D730'] = model.s2PC1Time != null ? Number(model.s2PC1Time) * 10 : 0
  dataWords['D731'] = model.s2PC2Time != null ? Number(model.s2PC2Time) * 10 : 0

  const { low: D732, high: D733 } = convertFloatToWord(
    parseFloat(model.resistanceMin?.toString() ?? '0')
  )
  dataWords['D732'] = D732
  dataWords['D733'] = D733
  const { low: D734, high: D735 } = convertFloatToWord(
    parseFloat(model.resistanceMax?.toString() ?? '0')
  )
  dataWords['D734'] = D734
  dataWords['D735'] = D735

  // ---- Stage 3 ----
  dataWords['D750'] = model.S3PC1Time != null ? Number(model.S3PC1Time) * 10 : 0
  dataWords['D751'] = model.S3PC2Time != null ? Number(model.S3PC2Time) * 10 : 0
  const { low: D752, high: D753 } = convertFloatToWord(
    parseFloat(model.impedanceMin?.toString() ?? '0')
  )
  dataWords['D752'] = D752
  dataWords['D753'] = D753
  const { low: D754, high: D755 } = convertFloatToWord(
    parseFloat(model.impedanceMax?.toString() ?? '0')
  )
  dataWords['D754'] = D754
  dataWords['D755'] = D755

  // Stage 4
  dataWords['D770'] = model.s4ClampTime != null ? Number(model.s4ClampTime) * 10 : 0
  dataWords['D771'] = model.s4LoadCellCylTime != null ? Number(model.s4LoadCellCylTime) * 10 : 0
  dataWords['D772'] = parseInt(bigDecimalMultiply(model.s4Cb1BrushPartialLoadMin, 100))
  dataWords['D773'] = parseInt(bigDecimalMultiply(model.s4Cb1BrushPartialLoadMax, 100))
  dataWords['D774'] = parseInt(bigDecimalMultiply(model.s4Cb1BrushFullLoadMin, 100))
  dataWords['D775'] = parseInt(bigDecimalMultiply(model.s4Cb1BrushFullLoadMax, 100))
  // dataWords["D776"] = parseInt(model.s4Cb1PartialPressPosition?.toString() || "0");

  const s4Cb1PartialPressPosition =
    parseFloat(model.s4Cb1PartialPressPosition?.toString() || '0') * 1000
  const { low: D776, high: D777 } = convertIntToWord(s4Cb1PartialPressPosition)
  dataWords['D776'] = D776
  dataWords['D777'] = D777

  const s4Cb1PartialPressSpeed = parseFloat(model.s4Cb1PartialPressSpeed?.toString() || '0')
  const { low: D778, high: D779 } = convertFloatToWord(s4Cb1PartialPressSpeed)
  dataWords['D778'] = D778
  dataWords['D779'] = D779

  const s4Cb1FullPressPosition = parseFloat(model.s4Cb1FullPressPosition?.toString() || '0') * 1000
  const { low: D780, high: D781 } = convertIntToWord(s4Cb1FullPressPosition)
  dataWords['D780'] = D780
  dataWords['D781'] = D781

  const s4FullSpeed = parseFloat(model.s4Cb1FullPressSpeed?.toString() || '0')
  const { low: D782, high: D783 } = convertFloatToWord(s4FullSpeed)
  dataWords['D782'] = D782
  dataWords['D783'] = D783

  // Stage 5
  dataWords['D790'] = model.s5ClampTime != null ? Number(model.s5ClampTime) * 10 : 0
  dataWords['D791'] = model.s5LoadCellCylTime != null ? Number(model.s5LoadCellCylTime) * 10 : 0
  dataWords['D792'] = parseInt(bigDecimalMultiply(model.s5Cb2BrushPartialLoadMin, 100))
  dataWords['D793'] = parseInt(bigDecimalMultiply(model.s5Cb2BrushPartialLoadMax, 100))
  dataWords['D794'] = parseInt(bigDecimalMultiply(model.s5Cb2BrushFullLoadMin, 100))
  dataWords['D795'] = parseInt(bigDecimalMultiply(model.s5Cb2BrushFullLoadMax, 100))

  const s5Cb2PartialPressPosition =
    parseFloat(model.s5Cb2PartialPressPosition?.toString() || '0') * 1000
  const { low: D796, high: D797 } = convertIntToWord(s5Cb2PartialPressPosition)
  dataWords['D796'] = D796
  dataWords['D797'] = D797

  const s5Cb2PartialPressSpeed = parseFloat(model.s5Cb2PartialPressSpeed?.toString() || '0')
  const { low: D798, high: D799 } = convertFloatToWord(s5Cb2PartialPressSpeed)
  dataWords['D798'] = D798
  dataWords['D799'] = D799

  const s5Cb2FullPressPosition = parseFloat(model.s5Cb2FullPressPosition?.toString() || '0') * 1000
  const { low: D800, high: D801 } = convertIntToWord(s5Cb2FullPressPosition)
  dataWords['D800'] = D800
  dataWords['D801'] = D801

  const s5FullSpeed = parseFloat(model.s5Cb2FullPressSpeed?.toString() || '0')
  const { low: D802, high: D803 } = convertFloatToWord(s5FullSpeed)
  dataWords['D802'] = D802
  dataWords['D803'] = D803

  dataWords['D804'] = model.s5SceneNo ?? 0

  // Stage 6
  dataWords['D810'] = model.S6BearingCylTime != null ? Number(model.S6BearingCylTime) * 10 : 0
  dataWords['D811'] = model.bearingAngleValue != null ? Number(model.bearingAngleValue) * 10 : 0
  dataWords['D812'] = model.s6SceneNo ?? 0

  // Stage 8
  dataWords['D860'] = model.upDownCylTime != null ? Number(model.upDownCylTime) * 10 : 0
  dataWords['D861'] = model.gripperTime != null ? Number(model.gripperTime) * 10 : 0

  const servoSpeed = parseFloat(model.servoSpeed?.toString() || '0')
  const { low: D862, high: D863 } = convertFloatToWord(servoSpeed)
  dataWords['D862'] = D862
  dataWords['D863'] = D863

  const partPickPOS = parseFloat(model.partPickPOS?.toString() || '0') * 1000
  const { low: D864, high: D865 } = convertIntToWord(partPickPOS)
  dataWords['D864'] = D864
  dataWords['D865'] = D865

  const partPlacePOS1 = parseFloat(model.pressPosition1?.toString() || '0') * 1000
  const { low: D866, high: D867 } = convertIntToWord(partPlacePOS1)
  dataWords['D866'] = D866
  dataWords['D867'] = D867

  const partPlacePOS2 = parseFloat(model.pressPosition2?.toString() || '0') * 1000
  const { low: D868, high: D869 } = convertIntToWord(partPlacePOS2)
  dataWords['D868'] = D868
  dataWords['D869'] = D869

  // Common
  dataWords['D870'] = model.programNo ?? 0

  // Position 3
  const position3 = parseFloat(model.pressPosition3?.toString() || '0') * 1000
  const { low: D872, high: D873 } = convertIntToWord(position3)
  dataWords['D872'] = D872
  dataWords['D873'] = D873

  // Position 4
  const position4 = parseFloat(model.pressPosition4?.toString() || '0') * 1000
  const { low: D874, high: D875 } = convertIntToWord(position4)
  dataWords['D874'] = D874
  dataWords['D875'] = D875

  // Position 5
  const position5 = parseFloat(model.pressPosition5?.toString() || '0') * 1000
  const { low: D876, high: D877 } = convertIntToWord(position5)
  dataWords['D876'] = D876
  dataWords['D877'] = D877

  // Position 6
  const position6 = parseFloat(model.pressPosition6?.toString() || '0') * 1000
  const { low: D878, high: D879 } = convertIntToWord(position6)
  dataWords['D878'] = D878
  dataWords['D879'] = D879

  // You may map D872–D879 to future fields like partPlacePOS3–6 if needed
  // === FINAL OUTPUT ===
  const all = {
    ...bitWords,
    ...dataWords
  }

  return all as PlcWords
}
