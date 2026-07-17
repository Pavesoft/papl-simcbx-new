import { createContext, useContext, type ReactNode } from 'react'
import { useForm, type UseFormReturnType } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Button, Text, Flex } from '@mantine/core'
import { api, unwrap } from '../../../../api'
import type { Prisma } from '@prisma/client'
import { successNotification } from '../../../../shared/util/successNotification'
import { errorNotification } from '../../../../shared/util/errorNotification'
import { useNavigate } from 'react-router-dom'
import type { ModelFormValues } from '../../modelSetting.model'

type CreateModelContextType = {
  form: UseFormReturnType<ModelFormValues>
  handleSave: () => void
}

const CreateModelContext = createContext<CreateModelContextType | undefined>(undefined)

export function CreateModelContextProvider({ children }: { children: ReactNode }) {
  const [opened, { open, close }] = useDisclosure(false)
  const [openedValidation, { open: openValidation, close: closeValidation }] = useDisclosure(false)
  const navigate = useNavigate()

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

  const handleSave = () => {
    if (
      !form.values.modelName ||
      !form.values.partNo ||
      !form.values.programNo ||
      form.values.resistanceMax <= form.values.resistanceMin ||
      form.values.impedanceMax <= form.values.impedanceMin ||
      form.values.s4Cb1BrushPartialLoadMax <= form.values.s4Cb1BrushPartialLoadMin ||
      form.values.s4Cb1BrushFullLoadMax <= form.values.s4Cb1BrushFullLoadMin ||
      form.values.s5Cb2BrushPartialLoadMax <= form.values.s5Cb2BrushPartialLoadMin ||
      form.values.s5Cb2BrushFullLoadMax <= form.values.s5Cb2BrushFullLoadMin ||
      !form.values.fileName
    ) {
      openValidation()
    } else {
      open()
    }
  }

  const handleSaveDetails = () => {
    const payload: Prisma.ModelSettingCreateInput = {
      ...form.values
    }
    unwrap(api.modelSettings.create(payload))
      .then(() => {
        close()
        successNotification({ title: 'Success', message: 'Model Settings Saved Successfully' })
        navigate('/model-config')
      })
      .catch(() => {
        errorNotification({ title: 'Error', message: 'Something went wrong' })
      })
  }

  const value: CreateModelContextType = { form, handleSave }

  // return <CreateModelContext.Provider value={value}>{children}</CreateModelContext.Provider>;

  return (
    <CreateModelContext.Provider value={value}>
      {children}

      {/* Add your modal here */}
      <Modal
        opened={opened}
        onClose={close}
        title={
          <Text c="#F5F5F5" fw={600} size="24px">
            CREATE MODEL?
          </Text>
        }
        size="lg"
        c="#F5F5F5"
      >
        {/* Modal content */}
        <Text size="lg" fw={500} mb="md">
          DO YOU WANT TO PROCEED WITH CREATING THE MODEL? THE DETAILS YOU'VE ENTERED WILL BE SAVED.
        </Text>
        <Text size="xl" fw={600} mb="md">
          STAGE CONFIGURATION
        </Text>
        <Flex wrap="wrap" gap="md">
          {Array.from({ length: 8 }, (_, i) => i + 1).map((stage) => {
            const field = `stage${stage}Check` as keyof ModelFormValues
            const selected = form.values[field]

            return (
              <Flex
                key={stage}
                align="center"
                justify="center"
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 100,
                  backgroundColor: selected ? '#F27B4880' : '#404040',
                  border: selected ? '1px solid #F27B48' : '1px solid #60666B',
                  marginRight: 16
                }}
              >
                <Text size="xl" fw={600} c={selected ? '#FFFBF7' : '#A1A1A1'}>
                  {stage}
                </Text>
              </Flex>
            )
          })}
        </Flex>

        <Flex mt={32} justify={'flex-end'}>
          <Button
            variant="gradient"
            gradient={{ from: '#F27B48', to: '#B4522E', deg: 180 }}
            onClick={() => handleSaveDetails()}
          >
            YES, CREATE
          </Button>
        </Flex>
      </Modal>
      <Modal
        opened={openedValidation}
        onClose={closeValidation}
        withCloseButton={false}
        size="lg"
        c="#F5F5F5"
      >
        {!form.values.modelName && (
          <Text size="xl" fw={600} c="#FF000C">
            Model Name is required
          </Text>
        )}
        {!form.values.partNo && (
          <Text size="xl" fw={600} c="#FF000C">
            Part No. is required
          </Text>
        )}
        {!form.values.programNo && (
          <Text size="xl" fw={600} c="#FF000C">
            Program No. is required
          </Text>
        )}
        {form.values.resistanceMax <= form.values.resistanceMin && (
          <Text size="xl" fw={600} c="#FF000C">
            Resistance Max should be greater than Resistance Min
          </Text>
        )}
        {form.values.impedanceMax <= form.values.impedanceMin && (
          <Text size="xl" fw={600} c="#FF000C">
            Impedance Max should be greater than Impedance Min
          </Text>
        )}
        {form.values.s4Cb1BrushPartialLoadMax <= form.values.s4Cb1BrushPartialLoadMin && (
          <Text size="xl" fw={600} c="#FF000C">
            Stage 4 Brush Partial Load Max should be greater than Min
          </Text>
        )}
        {form.values.s4Cb1BrushFullLoadMax <= form.values.s4Cb1BrushFullLoadMin && (
          <Text size="xl" fw={600} c="#FF000C">
            Stage 4 Brush Full Load Max should be greater than Min
          </Text>
        )}
        {form.values.s5Cb2BrushPartialLoadMax <= form.values.s5Cb2BrushPartialLoadMin && (
          <Text size="xl" fw={600} c="#FF000C">
            Stage 5 Brush Partial Load Max should be greater than Min
          </Text>
        )}
        {form.values.s5Cb2BrushFullLoadMax <= form.values.s5Cb2BrushFullLoadMin && (
          <Text size="xl" fw={600} c="#FF000C">
            Stage 5 Brush Full Load Max should be greater than Min
          </Text>
        )}
        {!form.values.fileName && (
          <Text size="xl" fw={600} c="#FF000C">
            File Name is required
          </Text>
        )}

        <Flex mt={32} justify={'flex-end'}>
          <Button
            variant="gradient"
            gradient={{ from: '#F27B48', to: '#B4522E', deg: 180 }}
            onClick={() => closeValidation()}
          >
            CLOSE
          </Button>
        </Flex>
      </Modal>
    </CreateModelContext.Provider>
  )
}

export function useCreateModelContext() {
  const context = useContext(CreateModelContext)
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider')
  }
  return context
}
