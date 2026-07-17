export interface ModelFormValues {
  modelName: string
  programNo: number
  rejectionBin: boolean
  lightCurtain: boolean
  doorLimitSwitch: boolean
  // STAGE
  stage1Check: boolean
  partPresent: boolean
  // STAGE
  stage2Check: boolean
  // Probe
  s2ProbeCyl1: boolean
  s2PC1Forward: boolean

  s2PC1Time: number
  // Probe
  s2ProbeCyl2: boolean
  s2PC2Forward: boolean

  s2PC2Time: number
  // RESISTANCE
  resistance: boolean
  resistanceMin: number
  resistanceMax: number
  // STAGE
  stage3Check: boolean
  // Probe
  S3ProbeCyl1: boolean
  S3PC1Forward: boolean

  S3PC1Time: number
  // Probe
  S3ProbeCyl2: boolean
  S3PC2Forward: boolean

  S3PC2Time: number
  // IMPEDANCE
  impedance: boolean
  impedanceMin: number
  impedanceMax: number
  // STAGE
  stage4Check: boolean
  // CLAMP
  s4Clamp: boolean
  s4ClampForward: boolean

  s4ClampTime: number
  // LOAD
  s4LoadCellCyl: boolean
  s4LoadCellCylForward: boolean

  s4LoadCellCylTime: number
  s4CbLoad: boolean
  s4CbPressingLoad: boolean
  s4Cb1BrushPartialLoadMin: number
  s4Cb1BrushPartialLoadMax: number
  s4Cb1BrushFullLoadMin: number
  s4Cb1BrushFullLoadMax: number
  s4Cb1PartialPressPosition: number
  s4Cb1PartialPressSpeed: number
  s4Cb1FullPressPosition: number
  s4Cb1FullPressSpeed: number
  // STAGE
  stage5Check: boolean
  // CLAMP
  s5Clamp: boolean
  s5ClampForward: boolean

  s5ClampTime: number
  // LOAD
  s5LoadCellCyl: boolean
  s5LoadCellCylForward: boolean

  s5LoadCellCylTime: number
  s5CbLoad: boolean
  s5CbPressingLoad: boolean
  s5CbLoadComparison: boolean
  s5Cb2BrushPartialLoadMin: number
  s5Cb2BrushPartialLoadMax: number
  s5Cb2BrushFullLoadMin: number
  s5Cb2BrushFullLoadMax: number
  s5Cb2PartialPressPosition: number
  s5Cb2PartialPressSpeed: number
  s5Cb2FullPressPosition: number
  s5Cb2FullPressSpeed: number
  // BOP
  s5BopCheck: boolean
  s5SceneNo: number
  // STAGE 6
  stage6Check: boolean
  // BEARING
  S6BearingCyl: boolean
  S6BearingCylForward: boolean

  S6BearingCylTime: number
  // BEARING
  bearingAngleCheck: boolean
  bearingAngleValue: number
  // BOP
  s6BopCheck: boolean
  s6SceneNo: number
  // STAGE
  stage7Check: boolean
  markingCheck: boolean
  partNo: string
  revNo: string
  fileName: string
  // STAGE 8
  stage8Check: boolean
  // UP
  upDownCylCheck: boolean
  upDownCylUp: boolean
  upDownCylTime: number
  // GRIPPER
  gripperCheck: boolean
  gripperGrip: boolean
  gripperTime: number
  // SCAN
  scanCheck: boolean
  // SERVO
  servoSpeed: number
  // PART
  partPickPOS: number
  pressPosition1: number
  pressPosition2: number
  pressPosition3: number
  pressPosition4: number
  pressPosition5: number
  pressPosition6: number
}
