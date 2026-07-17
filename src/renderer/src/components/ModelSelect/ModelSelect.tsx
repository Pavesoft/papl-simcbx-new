import { Select } from '@mantine/core'
import { useEffect, useState, type FC } from 'react'
import { useGlobalContext } from '../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { api, unwrap } from '../../api'
import { dumpModelSettingsToPlc } from '../../pages/AutoMode/utils'
import type { ModelSetting } from '@prisma/client'

export const ModelSelect: FC = () => {
  const {
    currentMode,
    writeMultipleValuesToPlc,
    selectedModel,
    setSelectedModel,
    setSelectedModelDetails
  } = useGlobalContext()

  const [modelList, setModelList] = useState<ModelSetting[]>([])

  useEffect(() => {
    unwrap(api.modelSettings.list())
      .then(setModelList)
      .catch((err) => console.log(err))
      .finally(() => {})
  }, [])

  useEffect(() => {
    const modelDetails = modelList?.find((model) => model.id === selectedModel) as ModelSetting
    setSelectedModelDetails(modelDetails)

    if (modelDetails) {
      dumpModelSettingsToPlc({
        plcWriter: writeMultipleValuesToPlc,
        selectedModelDetails: modelDetails
      })
    }
  }, [currentMode, selectedModel, modelList])

  useEffect(() => {}, [currentMode, selectedModel])

  return (
    <Select
      label="MODEL"
      placeholder="Select Model"
      allowDeselect={false}
      size="md"
      value={selectedModel ?? ''}
      data={modelList.map((model) => ({ value: model.id, label: model.modelName }))}
      styles={{
        label: {
          fontSize: '22px',
          fontWeight: 500
        },
        option: {
          fontSize: '22px',
          fontWeight: 500
        },
        input: {
          fontSize: '22px',
          fontWeight: 500
        }
      }}
      onChange={(value) => {
        setSelectedModel(value ?? null)
        unwrap(
          api.adminUser.updateModelSettings({
            selectedModel: value ?? ''
          })
        ).catch((err) => console.error(err))
      }}
    />
  )
}
