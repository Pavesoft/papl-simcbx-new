import { createContext, useContext, useEffect, type ReactNode } from 'react'
import { useForm, type UseFormReturnType } from '@mantine/form'
import { api, unwrap } from '../../../../api'
import type { Prisma } from '@prisma/client'
import { successNotification } from '../../../../shared/util/successNotification'
import { errorNotification } from '../../../../shared/util/errorNotification'
import { useNavigate, useParams } from 'react-router-dom'
import type { ModelFormValues } from '../../modelSetting.model'

type ViewModelContextType = {
  form: UseFormReturnType<ModelFormValues>
  handleSave: () => void
}

const ViewModelContext = createContext<ViewModelContextType | undefined>(undefined)

export function ViewModelContextProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate()
  const { key, id } = useParams()

  useEffect(() => {
    if (id) {
      unwrap(api.modelSettings.byId({ id: id })).then((data) => {
        if (data) {
          if (key === 'duplicate-item') {
            form.setValues({
              // ...data,
              modelName: data.modelName + ' COPY',
              programNo: data.programNo,
              rejectionBin: data.rejectionBin ?? false,
              lightCurtain: data.lightCurtain ?? false,
              doorLimitSwitch: data.doorLimitSwitch ?? false,

              // Add similar conversions for all nullable fields:
              // Example for booleans:
              stage1Check: data.stage1Check ?? false,
              partPresent: data.partPresent ?? false,
              stage2Check: data.stage2Check ?? false,
              s2ProbeCyl1: data.s2ProbeCyl1 ?? false,
              s2PC1Forward: data.s2PC1Forward ?? false,
              s2PC1Time: Number(data.s2PC1Time ?? 0),
              s2ProbeCyl2: data.s2ProbeCyl2 ?? false,
              s2PC2Forward: data.s2PC2Forward ?? false,
              s2PC2Time: Number(data.s2PC2Time ?? 0),
              resistance: data.resistance ?? false,
              resistanceMin: Number(data.resistanceMin ?? 0),
              resistanceMax: Number(data.resistanceMax ?? 0),
              stage3Check: data.stage3Check ?? false,
              S3ProbeCyl1: data.S3ProbeCyl1 ?? false,
              S3PC1Forward: data.S3PC1Forward ?? false,
              S3PC1Time: Number(data.S3PC1Time ?? 0),
              S3ProbeCyl2: data.S3ProbeCyl2 ?? false,
              S3PC2Forward: data.S3PC2Forward ?? false,
              S3PC2Time: Number(data.S3PC2Time ?? 0),
              impedance: data.impedance ?? false,
              impedanceMin: Number(data.impedanceMin ?? 0),
              impedanceMax: Number(data.impedanceMax ?? 0),
              stage4Check: data.stage4Check ?? false,
              s4Clamp: data.s4Clamp ?? false,
              s4ClampForward: data.s4ClampForward ?? false,
              s4ClampTime: Number(data.s4ClampTime ?? 0),
              s4LoadCellCyl: data.s4LoadCellCyl ?? false,
              s4LoadCellCylForward: data.s4LoadCellCylForward ?? false,
              s4LoadCellCylTime: Number(data.s4LoadCellCylTime ?? 0),
              s4CbLoad: data.s4CbLoad ?? false,
              s4CbPressingLoad: data.s4CbPressingLoad ?? false,
              s4Cb1BrushPartialLoadMin: Number(data.s4Cb1BrushPartialLoadMin ?? 0),
              s4Cb1BrushPartialLoadMax: Number(data.s4Cb1BrushPartialLoadMax ?? 0),
              s4Cb1BrushFullLoadMin: Number(data.s4Cb1BrushFullLoadMin ?? 0),
              s4Cb1BrushFullLoadMax: Number(data.s4Cb1BrushFullLoadMax ?? 0),
              s4Cb1PartialPressPosition: Number(data.s4Cb1PartialPressPosition ?? 0),
              s4Cb1PartialPressSpeed: Number(data.s4Cb1PartialPressSpeed ?? 0),
              s4Cb1FullPressPosition: Number(data.s4Cb1FullPressPosition ?? 0),
              s4Cb1FullPressSpeed: Number(data.s4Cb1FullPressSpeed ?? 0),
              stage5Check: data.stage5Check ?? false,
              s5Clamp: data.s5Clamp ?? false,
              s5ClampForward: data.s5ClampForward ?? false,
              s5ClampTime: Number(data.s5ClampTime ?? 0),
              s5LoadCellCyl: data.s5LoadCellCyl ?? false,
              s5LoadCellCylForward: data.s5LoadCellCylForward ?? false,
              s5LoadCellCylTime: Number(data.s5LoadCellCylTime ?? 0),
              s5CbLoad: data.s5CbLoad ?? false,
              s5CbPressingLoad: data.s5CbPressingLoad ?? false,
              s5CbLoadComparison: data.s5CbLoadComparison ?? false,
              s5Cb2BrushPartialLoadMin: Number(data.s5Cb2BrushPartialLoadMin ?? 0),
              s5Cb2BrushPartialLoadMax: Number(data.s5Cb2BrushPartialLoadMax ?? 0),
              s5Cb2BrushFullLoadMin: Number(data.s5Cb2BrushFullLoadMin ?? 0),
              s5Cb2BrushFullLoadMax: Number(data.s5Cb2BrushFullLoadMax ?? 0),
              s5Cb2PartialPressPosition: Number(data.s5Cb2PartialPressPosition ?? 0),
              s5Cb2PartialPressSpeed: Number(data.s5Cb2PartialPressSpeed ?? 0),
              s5Cb2FullPressPosition: Number(data.s5Cb2FullPressPosition ?? 0),
              s5Cb2FullPressSpeed: Number(data.s5Cb2FullPressSpeed ?? 0),
              s5BopCheck: data.s5BopCheck ?? false,
              s5SceneNo: Number(data.s5SceneNo ?? 0),
              stage6Check: data.stage6Check ?? false,
              S6BearingCyl: data.S6BearingCyl ?? false,
              S6BearingCylForward: data.S6BearingCylForward ?? false,
              S6BearingCylTime: Number(data.S6BearingCylTime ?? 0),
              bearingAngleCheck: data.bearingAngleCheck ?? false,
              bearingAngleValue: Number(data.bearingAngleValue ?? 0),
              s6BopCheck: data.s6BopCheck ?? false,
              s6SceneNo: Number(data.s6SceneNo ?? 0),
              stage7Check: data.stage7Check ?? false,
              markingCheck: data.markingCheck ?? false,
              partNo: String(data.partNo ?? ''),
              revNo: String(data.revNo ?? ''),
              fileName: String(data.fileName ?? ''),
              stage8Check: data.stage8Check ?? false,
              upDownCylCheck: data.upDownCylCheck ?? false,
              upDownCylUp: data.upDownCylUp ?? false,
              upDownCylTime: Number(data.upDownCylTime ?? 0),
              gripperCheck: data.gripperCheck ?? false,
              gripperGrip: data.gripperGrip ?? false,
              gripperTime: Number(data.gripperTime ?? 0),
              scanCheck: data.scanCheck ?? false,
              servoSpeed: Number(data.servoSpeed ?? 0),
              partPickPOS: Number(data.partPickPOS ?? 0),
              pressPosition1: Number(data.pressPosition1 ?? 0),
              pressPosition2: Number(data.pressPosition2 ?? 0),
              pressPosition3: Number(data.pressPosition3 ?? 0),
              pressPosition4: Number(data.pressPosition4 ?? 0),
              pressPosition5: Number(data.pressPosition5 ?? 0),
              pressPosition6: Number(data.pressPosition6 ?? 0)
            })
          } else {
            form.setValues({
              ...data,
              rejectionBin: data.rejectionBin ?? false,
              lightCurtain: data.lightCurtain ?? false,
              doorLimitSwitch: data.doorLimitSwitch ?? false,
              programNo: data.programNo ?? 0,
              stage1Check: data.stage1Check ?? false,
              partPresent: data.partPresent ?? false,
              stage2Check: data.stage2Check ?? false,
              s2ProbeCyl1: data.s2ProbeCyl1 ?? false,
              s2PC1Forward: data.s2PC1Forward ?? false,
              s2PC1Time: Number(data.s2PC1Time ?? 0),
              s2ProbeCyl2: data.s2ProbeCyl2 ?? false,
              s2PC2Forward: data.s2PC2Forward ?? false,
              s2PC2Time: Number(data.s2PC2Time ?? 0),
              resistance: data.resistance ?? false,
              resistanceMin: Number(data.resistanceMin ?? 0),
              resistanceMax: Number(data.resistanceMax ?? 0),
              stage3Check: data.stage3Check ?? false,
              S3ProbeCyl1: data.S3ProbeCyl1 ?? false,
              S3PC1Forward: data.S3PC1Forward ?? false,
              S3PC1Time: Number(data.S3PC1Time ?? 0),
              S3ProbeCyl2: data.S3ProbeCyl2 ?? false,
              S3PC2Forward: data.S3PC2Forward ?? false,
              S3PC2Time: Number(data.S3PC2Time ?? 0),
              impedance: data.impedance ?? false,
              impedanceMin: Number(data.impedanceMin ?? 0),
              impedanceMax: Number(data.impedanceMax ?? 0),
              stage4Check: data.stage4Check ?? false,
              s4Clamp: data.s4Clamp ?? false,
              s4ClampForward: data.s4ClampForward ?? false,
              s4ClampTime: Number(data.s4ClampTime ?? 0),
              s4LoadCellCyl: data.s4LoadCellCyl ?? false,
              s4LoadCellCylForward: data.s4LoadCellCylForward ?? false,
              s4LoadCellCylTime: Number(data.s4LoadCellCylTime ?? 0),
              s4CbLoad: data.s4CbLoad ?? false,
              s4CbPressingLoad: data.s4CbPressingLoad ?? false,
              s4Cb1BrushPartialLoadMin: Number(data.s4Cb1BrushPartialLoadMin ?? 0),
              s4Cb1BrushPartialLoadMax: Number(data.s4Cb1BrushPartialLoadMax ?? 0),
              s4Cb1BrushFullLoadMin: Number(data.s4Cb1BrushFullLoadMin ?? 0),
              s4Cb1BrushFullLoadMax: Number(data.s4Cb1BrushFullLoadMax ?? 0),
              s4Cb1PartialPressPosition: Number(data.s4Cb1PartialPressPosition ?? 0),
              s4Cb1PartialPressSpeed: Number(data.s4Cb1PartialPressSpeed ?? 0),
              s4Cb1FullPressPosition: Number(data.s4Cb1FullPressPosition ?? 0),
              s4Cb1FullPressSpeed: Number(data.s4Cb1FullPressSpeed ?? 0),
              stage5Check: data.stage5Check ?? false,
              s5Clamp: data.s5Clamp ?? false,
              s5ClampForward: data.s5ClampForward ?? false,
              s5ClampTime: Number(data.s5ClampTime ?? 0),
              s5LoadCellCyl: data.s5LoadCellCyl ?? false,
              s5LoadCellCylForward: data.s5LoadCellCylForward ?? false,
              s5LoadCellCylTime: Number(data.s5LoadCellCylTime ?? 0),
              s5CbLoad: data.s5CbLoad ?? false,
              s5CbPressingLoad: data.s5CbPressingLoad ?? false,
              s5CbLoadComparison: data.s5CbLoadComparison ?? false,
              s5Cb2BrushPartialLoadMin: Number(data.s5Cb2BrushPartialLoadMin ?? 0),
              s5Cb2BrushPartialLoadMax: Number(data.s5Cb2BrushPartialLoadMax ?? 0),
              s5Cb2BrushFullLoadMin: Number(data.s5Cb2BrushFullLoadMin ?? 0),
              s5Cb2BrushFullLoadMax: Number(data.s5Cb2BrushFullLoadMax ?? 0),
              s5Cb2PartialPressPosition: Number(data.s5Cb2PartialPressPosition ?? 0),
              s5Cb2PartialPressSpeed: Number(data.s5Cb2PartialPressSpeed ?? 0),
              s5Cb2FullPressPosition: Number(data.s5Cb2FullPressPosition ?? 0),
              s5Cb2FullPressSpeed: Number(data.s5Cb2FullPressSpeed ?? 0),
              s5BopCheck: data.s5BopCheck ?? false,
              s5SceneNo: Number(data.s5SceneNo ?? 0),
              stage6Check: data.stage6Check ?? false,
              S6BearingCyl: data.S6BearingCyl ?? false,
              S6BearingCylForward: data.S6BearingCylForward ?? false,
              S6BearingCylTime: Number(data.S6BearingCylTime ?? 0),
              bearingAngleCheck: data.bearingAngleCheck ?? false,
              bearingAngleValue: Number(data.bearingAngleValue ?? 0),
              s6BopCheck: data.s6BopCheck ?? false,
              s6SceneNo: Number(data.s6SceneNo ?? 0),
              stage7Check: data.stage7Check ?? false,
              markingCheck: data.markingCheck ?? false,
              partNo: String(data.partNo ?? ''),
              revNo: String(data.revNo ?? ''),
              fileName: String(data.fileName ?? ''),
              stage8Check: data.stage8Check ?? false,
              upDownCylCheck: data.upDownCylCheck ?? false,
              upDownCylUp: data.upDownCylUp ?? false,
              upDownCylTime: Number(data.upDownCylTime ?? 0),
              gripperCheck: data.gripperCheck ?? false,
              gripperGrip: data.gripperGrip ?? false,
              gripperTime: Number(data.gripperTime ?? 0),
              scanCheck: data.scanCheck ?? false,
              servoSpeed: Number(data.servoSpeed ?? 0),
              partPickPOS: Number(data.partPickPOS ?? 0),
              pressPosition1: Number(data.pressPosition1 ?? 0),
              pressPosition2: Number(data.pressPosition2 ?? 0),
              pressPosition3: Number(data.pressPosition3 ?? 0),
              pressPosition4: Number(data.pressPosition4 ?? 0),
              pressPosition5: Number(data.pressPosition5 ?? 0),
              pressPosition6: Number(data.pressPosition6 ?? 0)
            })
          }
        }
      })
    }
  }, [id])

  const form = useForm<ModelFormValues>({
    initialValues: {
      modelName: '',
      programNo: 0,
      rejectionBin: true,
      lightCurtain: true,
      doorLimitSwitch: true,

      stage1Check: true,
      partPresent: true,

      stage2Check: true,

      s2ProbeCyl1: true,
      s2PC1Forward: true,
      s2PC1Time: 0.1,

      s2ProbeCyl2: true,
      s2PC2Forward: true,
      s2PC2Time: 0.1,

      resistance: true,
      resistanceMin: 1,
      resistanceMax: 500,

      stage3Check: true,

      S3ProbeCyl1: true,
      S3PC1Forward: true,
      S3PC1Time: 0.1,

      S3ProbeCyl2: true,
      S3PC2Forward: true,
      S3PC2Time: 0.1,

      impedance: true,
      impedanceMin: 0.1,
      impedanceMax: 2,

      stage4Check: true,

      s4Clamp: true,
      s4ClampForward: true,
      s4ClampTime: 0.1,

      s4LoadCellCyl: true,
      s4LoadCellCylForward: true,
      s4LoadCellCylTime: 0.1,
      s4CbLoad: true,
      s4CbPressingLoad: true,
      s4Cb1BrushPartialLoadMin: 0.1,
      s4Cb1BrushPartialLoadMax: 5,
      s4Cb1BrushFullLoadMin: 0.1,
      s4Cb1BrushFullLoadMax: 5,
      s4Cb1PartialPressPosition: 0,
      s4Cb1PartialPressSpeed: 0.1,
      s4Cb1FullPressPosition: 0,
      s4Cb1FullPressSpeed: 0.1,

      stage5Check: true,

      s5Clamp: true,
      s5ClampForward: true,
      s5ClampTime: 0.1,

      s5LoadCellCyl: true,
      s5LoadCellCylForward: true,
      s5LoadCellCylTime: 0.1,
      s5CbLoad: true,
      s5CbPressingLoad: true,
      s5CbLoadComparison: true,
      s5Cb2BrushPartialLoadMin: 0.1,
      s5Cb2BrushPartialLoadMax: 5,
      s5Cb2BrushFullLoadMin: 0.1,
      s5Cb2BrushFullLoadMax: 5,
      s5Cb2PartialPressPosition: 0,
      s5Cb2PartialPressSpeed: 0.1,
      s5Cb2FullPressPosition: 0,
      s5Cb2FullPressSpeed: 0.1,

      s5BopCheck: true,
      s5SceneNo: 0,

      stage6Check: true,

      S6BearingCyl: true,
      S6BearingCylForward: true,
      S6BearingCylTime: 0.1,

      bearingAngleCheck: true,
      bearingAngleValue: 0.1,

      s6BopCheck: true,
      s6SceneNo: 0,

      stage7Check: true,
      markingCheck: true,
      partNo: '',
      revNo: '',
      fileName: '',

      stage8Check: true,
      upDownCylCheck: true,
      upDownCylUp: true,
      upDownCylTime: 0.1,

      gripperCheck: true,
      gripperGrip: true,
      gripperTime: 0.1,

      scanCheck: true,
      servoSpeed: 0.1,

      partPickPOS: 0,
      pressPosition1: 0,
      pressPosition2: 0,
      pressPosition3: 0,
      pressPosition4: 0,
      pressPosition5: 0,
      pressPosition6: 0
    }
  })

  const handleSaveDetails = () => {
    if (!id) {
      errorNotification({ title: 'Error', message: 'Missing model id' })
      return
    }
    const payload = {
      id: id as string,
      ...form.values
    }
    unwrap(api.modelSettings.update(payload))
      .then(() => {
        successNotification({ title: 'Success', message: 'Model Settings Saved Successfully' })
        navigate('/model-config')
      })
      .catch((e) => {
        if (e?.message && e?.message.includes('Unique constraint')) {
          // Try extracting the unique constraint field with regex
          const match = e.message.match(/Unique constraint failed on field\(s\):\s*(\S+)/)
          if (match) {
            const uniqueConstraintField = match[1]
            errorNotification({
              title: 'Error',
              message: `${uniqueConstraintField} already exists. Please use a different value.`
            })
          } else {
            errorNotification({ title: 'Error', message: 'Something went wrong' })
          }
        } else {
          console.error('Unexpected error:', e) // Log unexpected errors for debugging
          errorNotification({ title: 'Error', message: 'Something went wrong' })
        }
      })
  }
  const handleDuplicateItem = () => {
    const payload: Prisma.ModelSettingCreateInput = {
      ...form.values,
      id: undefined // Ensure id is not included in the create payload
    }

    unwrap(api.modelSettings.create(payload))
      .then(() => {
        close()
        successNotification({ title: 'Success', message: 'Model Settings Saved Successfully' })
        navigate('/model-config')
      })
      .catch((e) => {
        if (e?.message && e?.message.includes('Unique constraint')) {
          // Try extracting the unique constraint field with regex
          const match = e.message.match(/Unique constraint failed on field\(s\):\s*(\S+)/)
          if (match) {
            const uniqueConstraintField = match[1]
            errorNotification({
              title: 'Error',
              message: `${uniqueConstraintField} already exists. Please use a different value.`
            })
          } else {
            errorNotification({ title: 'Error', message: 'Something went wrong' })
          }
        } else {
          console.error('Unexpected error:', e) // Log unexpected errors for debugging
          errorNotification({ title: 'Error', message: 'Something went wrong' })
        }
      })
  }
  const handleSave = () => {
    if (key === 'duplicate-item') {
      handleDuplicateItem()
    } else {
      handleSaveDetails()
    }
  }

  const value: ViewModelContextType = { form, handleSave }

  return <ViewModelContext.Provider value={value}>{children}</ViewModelContext.Provider>
}

export function useViewModelContext() {
  const context = useContext(ViewModelContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider')
  }
  return context
}
