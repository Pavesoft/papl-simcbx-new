import { ActionIcon, Button, Flex, Modal, Text, Title, Tooltip } from '@mantine/core'
import { api, unwrap } from '../../api'
import { useNavigate } from 'react-router-dom'
import { useEffect, useMemo, useState } from 'react'
import {
  MantineReactTable,
  // createRow,
  type MRT_ColumnDef,
  useMantineReactTable
} from 'mantine-react-table'
import { IconCopy, IconEye, IconPlus, IconTrash } from '@tabler/icons-react'
import type { ModelSetting } from '@prisma/client'
import { useDisclosure } from '@mantine/hooks'
import { successNotification } from '../../shared/util/successNotification'
import { errorNotification } from '../../shared/util/errorNotification'
import { modals } from '@mantine/modals'

const ModelConfig = () => {
  const navigate = useNavigate()

  const [deleteOpened, { open: openDelete, close: closeDelete }] = useDisclosure(false)
  const [modelsList, setModelsList] = useState<ModelSetting[]>([])
  const [duplicateItemId, setDuplicateItemId] = useState<string | null>(null)

  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<ModelSetting>[]>(
    () => [
      {
        accessorKey: 'programNo', //access nested data with dot notation
        header: 'PROGRAM NO.'
      },
      {
        accessorKey: 'modelName',
        header: 'MODEL NAME'
      }
    ],
    []
  )

  const table = useMantineReactTable({
    columns,
    data: modelsList,
    enableBottomToolbar: false,
    enableTopToolbar: false,
    enableColumnVirtualization: true,
    enableColumnFilterModes: true,
    enableGlobalFilterModes: true,
    enableFacetedValues: true,
    enablePagination: false,
    enableRowNumbers: true,
    enableRowVirtualization: true,
    enableEditing: true,
    enableStickyHeader: true,
    enableColumnPinning: true,
    initialState: {
      density: 'md',
      columnPinning: {
        right: ['mrt-row-actions']
      }
    },
    enableRowActions: true,
    renderRowActions: ({ row }) => (
      <Flex gap="md">
        <Tooltip label="View">
          <ActionIcon
            w={44}
            h={36}
            variant="gradient"
            aria-label="Gradient action icon"
            gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
            style={{ border: '1px solid #525252' }}
            onClick={() => navigate(`/model-config/view-model/${row.original.id}`)}
          >
            <IconEye />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Duplicate">
          <ActionIcon
            variant="gradient"
            w={44}
            h={36}
            aria-label="Gradient action icon"
            gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
            style={{ border: '1px solid #525252' }}
            onClick={() => {
              // open();

              modals.openContextModal({
                modal: 'demonstration',
                title: `DUPLICATE ${row.original.modelName} ?`,
                innerProps: {
                  modalBody:
                    'SO YOU WANT TO DUPLICATE THIS MODEL? A COPY WILL BE CREATED WITHE THE SAME CONFIGURATIONS.',
                  buttonText: 'DUPLICATE',
                  function: () => {
                    // handleEditChanges();
                    // setDuplicateItemId(row.original.id);
                    // setDuplicateModelName(row.original.modelName + "_COPY");
                    navigate(`/model-config/duplicate-item/${row.original.id}`)
                  }
                }
              })
            }}
          >
            <IconCopy />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon
            variant="gradient"
            w={44}
            h={36}
            aria-label="Gradient action icon"
            gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
            style={{ border: '1px solid #525252' }}
            onClick={() => {
              openDelete()
              setDuplicateItemId(row.original.id)
            }}
          >
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    )
  })

  const handleDeleteItem = () => {
    unwrap(api.modelSettings.delete({ id: duplicateItemId as string }))
      .then(() => {
        successNotification({ title: 'Success', message: 'Model Setting Deleted Successfully' })
        unwrap(api.modelSettings.list()).then(setModelsList)
        closeDelete()
      })
      .catch(() => {
        errorNotification({ title: 'Error', message: 'Something went wrong' })
      })
  }
  useEffect(() => {
    unwrap(api.modelSettings.list()).then(setModelsList)
  }, [])
  return (
    <Flex direction="column" p={24}>
      <Flex direction="row" justify="space-between" mb={24}>
        <Title order={2}>MODELS CONFIGURATION</Title>

        <Button
          onClick={() => {
            navigate('/model-config/create-model')
          }}
          variant="gradient"
          gradient={{ from: '#F27B48', to: '#B4522E', deg: 180 }}
          leftSection={<IconPlus size={20} />}
        >
          <Text size="xl" fw={600} c="#E5E5E5">
            CREATE MODELS
          </Text>
        </Button>
      </Flex>
      <MantineReactTable table={table} />

      <Modal opened={deleteOpened} onClose={closeDelete} title="DELETE MODEL?" size="lg">
        {/* Modal content */}
        <Text size="lg" fw={500}>
          ARE YOU SURE YOU WANT TO DELETE THIS MODEL? THIS WILL PERMANENTLY REMOVE ALL ASSOCIATED
          CONFIGURATIONS AND DATA. THIS ACTION CANNOT BE UNDONE.
        </Text>

        <Flex mt={32} justify={'flex-end'}>
          <Button bg="#FB2C36" onClick={() => handleDeleteItem()}>
            YES, DELETE
          </Button>
        </Flex>
      </Modal>
    </Flex>
  )
}

export default ModelConfig
