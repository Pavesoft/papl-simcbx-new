import {
  ActionIcon,
  Button,
  Checkbox,
  Divider,
  Flex,
  Modal,
  PasswordInput,
  Select,
  Text,
  TextInput,
  Title,
  Tooltip
} from '@mantine/core'
import { api, unwrap } from '../../api'

import { useEffect, useMemo, useState } from 'react'
import {
  MantineReactTable,
  // createRow,
  type MRT_ColumnDef,
  useMantineReactTable
} from 'mantine-react-table'
import { IconEye, IconEyeCheck, IconEyeOff, IconPlus, IconTrash } from '@tabler/icons-react'
import { type PortalUserRole, type PortalUser, type Prisma } from '@prisma/client'
import { useDisclosure } from '@mantine/hooks'
import { successNotification } from '../../shared/util/successNotification'
import { errorNotification } from '../../shared/util/errorNotification'
import moment from 'moment'
import { isNotEmpty, useForm } from '@mantine/form'
import { modals } from '@mantine/modals'
import { useGlobalContext } from '../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'

const VisibilityToggleIcon = ({ reveal }: { reveal: boolean }) =>
  reveal ? (
    <IconEyeOff
      style={{ width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)' }}
      color="#F27B48"
    />
  ) : (
    <IconEyeCheck
      style={{ width: 'var(--psi-icon-size)', height: 'var(--psi-icon-size)' }}
      color="#F27B48"
    />
  )

const LoginConfig = () => {
  const [opened, { open, close }] = useDisclosure(false)
  const [viewOpened, { open: openView, close: closeView }] = useDisclosure(false)
  const [userList, setUserList] = useState<PortalUser[]>([])
  const [isEditing, setIsEditing] = useState(false)
  const [resetPassword, setResetPassword] = useState(false)
  const { userDetails } = useGlobalContext()

  const UserRole = {
    SUPER_ADMIN: 'SUPER_ADMIN',
    ADMIN: 'ADMIN',
    OPERATOR: 'OPERATOR'
  }
  const USER_ROLE = Object.values(UserRole).map((role) => ({
    value: role,
    label: role
  }))

  const form = useForm({
    initialValues: {
      id: '',
      operatorId: '',
      username: '',
      password: '',
      confirmPassword: '',
      userRole: '',
      autoMode: true,
      loginConfig: false,
      modelConfig: false,
      reports: false,
      manual: false,
      cycleReset: false
    },
    validate: {
      operatorId: isNotEmpty('OPERATOR ID IS MANDATORY'),
      username: isNotEmpty('USERNAME IS MANDATORY'),
      password: (value) => {
        if (!isEditing || (isEditing && resetPassword)) {
          return isNotEmpty('PASSWORD IS MANDATORY')(value)
        }
        return null
      },
      confirmPassword: (value, values) => {
        if (!isEditing || (isEditing && resetPassword)) {
          if (!value) return 'CONFIRM PASSWORD IS MANDATORY'
          if (value !== values.password) return 'PASSWORDS DO NOT MATCH'
        }
        return null
      },
      userRole: isNotEmpty('USER ROLE IS MANDATORY')
    }
  })

  //should be memoized or stable
  const columns = useMemo<MRT_ColumnDef<PortalUser>[]>(
    () => [
      {
        accessorKey: 'createdAt', //access nested data with dot notation
        header: 'DATE',
        Cell: ({ row }) => moment(row.original?.createdAt).format('MMMM DD, yyyy')
      },
      {
        accessorKey: 'operatorId',
        header: 'OPERATOR ID'
      },
      {
        accessorKey: 'userName',
        header: 'USER NAME'
      },
      {
        accessorKey: 'userRole',
        header: 'USER ROLE'
      }
    ],
    []
  )

  const table = useMantineReactTable({
    columns,
    data: userList,
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
            variant="gradient"
            w={44}
            h={36}
            aria-label="Gradient action icon"
            gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
            style={{ border: '1px solid #525252' }}
            onClick={() => {
              openView()
              unwrap(api.adminUser.byId({ id: row.original.id })).then((data) => {
                if (data) {
                  form.setFieldValue('id', data.id)
                  form.setFieldValue('autoMode', data.autoMode)
                  form.setFieldValue('operatorId', data.operatorId)
                  form.setFieldValue('username', data.userName)
                  form.setFieldValue('loginConfig', data.loginConfig)
                  form.setFieldValue('modelConfig', data.modelConfig)
                  form.setFieldValue('reports', data.reports)
                  form.setFieldValue('manual', data.manual)
                  form.setFieldValue('cycleReset', data.cycleReset)
                  form.setFieldValue('userRole', data.userRole)
                }
              })
            }}
          >
            <IconEye />
          </ActionIcon>
        </Tooltip>

        <Tooltip label="Delete">
          <ActionIcon
            w={44}
            h={36}
            aria-label="Gradient action icon"
            variant="gradient"
            gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
            style={{ border: '1px solid #525252' }}
            disabled={row.original.id === userDetails?.id}
            onClick={() => {
              form.setFieldValue('id', row.original.id)
              modals.openContextModal({
                modal: 'demonstration',
                title: 'DELETE USER?',
                innerProps: {
                  modalBody:
                    'THIS WILL PERMANENTLY REMOVE THE USER AND ALL RELATED DATA, THIS ACTION CANNOT BE UNDONE.',
                  buttonText: 'DELETE',
                  function: () => {
                    handleDeleteItem()
                  }
                }
              })
            }}
          >
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    )
  })

  const handleDeleteItem = () => {
    unwrap(api.adminUser.delete({ id: form.values.id }))
      .then(() => {
        successNotification({ title: 'Success', message: 'User Deleted Successfully' })
        unwrap(api.adminUser.list()).then(setUserList)
      })
      .catch(() => {
        errorNotification({ title: 'Error', message: 'Something went wrong' })
      })
  }
  const handleCreateUser = async () => {
    const payload: Prisma.PortalUserCreateInput & { password: string } = {
      operatorId: form.values.operatorId,
      userName: form.values.username,
      password: form.values.password,
      autoMode: form.values.autoMode,
      loginConfig: form.values.loginConfig,
      modelConfig: form.values.modelConfig,
      reports: form.values.reports,
      manual: form.values.manual,
      cycleReset: form.values.cycleReset,
      userRole: form.values.userRole as PortalUserRole
    }

    if (!form.validate().hasErrors) {
      await unwrap(api.adminUser.create(payload))
        .then(() => {
          unwrap(api.adminUser.list()).then(setUserList)
          close()
          form.reset()
          successNotification({
            title: 'USER CREATED SUCCESSFULLY!',
            message: 'YOU HAVE SUCCESSFULLY CREATED USER IN THE SYSTEM.'
          })
        })
        .catch(() => {
          errorNotification({
            title: 'USER CREATION FAILED!',
            message: 'SOMETHING WENT WRONG, PLEASE TRY AGAIN LATER.'
          })
        })
    }
  }

  const handleEditChanges = async () => {
    if (!form.validate().hasErrors) {
      await unwrap(
        api.adminUser.update({
          id: form.values.id,
          operatorId: form.values.operatorId,
          userName: form.values.username,
          password: form.values.password,
          autoMode: form.values.autoMode,
          loginConfig: form.values.loginConfig,
          modelConfig: form.values.modelConfig,
          reports: form.values.reports,
          manual: form.values.manual,
          cycleReset: form.values.cycleReset,
          userRole: form.values.userRole as PortalUserRole
        })
      )
        .then(() => {
          unwrap(api.adminUser.list()).then(setUserList)
          closeView()
          form.reset()
          setIsEditing(false)
          setResetPassword(false)
          successNotification({
            title: 'USER CREATED SUCCESSFULLY!',
            message: 'YOU HAVE SUCCESSFULLY CREATED USER IN THE SYSTEM.'
          })
        })
        .catch(() => {
          errorNotification({
            title: 'USER CREATION FAILED!',
            message: 'SOMETHING WENT WRONG, PLEASE TRY AGAIN LATER.'
          })
        })
    }
  }

  useEffect(() => {
    unwrap(api.adminUser.list()).then(setUserList)
  }, [])

  return (
    <Flex direction="column" p={24}>
      <Flex direction="row" justify="space-between" mb={24}>
        <Title order={2}>ALL USERS</Title>

        <Button
          onClick={() => {
            open()
          }}
          variant="gradient"
          gradient={{ from: '#F27B48', to: '#B4522E', deg: 180 }}
          leftSection={<IconPlus size={20} />}
        >
          <Text size="xl" fw={600} c="#E5E5E5">
            CREATE USER
          </Text>
        </Button>
      </Flex>
      <MantineReactTable table={table} />
      <Modal
        opened={opened}
        onClose={() => {
          close()
          form.reset()
        }}
        title="CREATE USER?"
        size="900"
      >
        <form
          onSubmit={form.onSubmit(() => {
            if (form.isValid()) {
              modals.openContextModal({
                modal: 'demonstration',
                title: 'CREATE USER?',
                innerProps: {
                  modalBody:
                    'ARE YOU SURE YOU WANT TO CREATE THIS USER? CREDENTIALS WILL BE GENERATED AFTER USER CREATION.',
                  buttonText: 'YES, CREATE',
                  function: () => {
                    handleCreateUser()
                  }
                }
              })
            }
          })}
        >
          <Flex direction="column">
            <Flex direction="column" rowGap={16}>
              <Flex columnGap={24}>
                <TextInput
                  label="OPERATOR ID"
                  placeholder="ENTER OPERATOR ID"
                  w={'50%'}
                  withAsterisk
                  styles={{
                    input: {
                      borderColor: '#737373',
                      backgroundColor: '#F5F5F5',
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#3F3F47'
                    },
                    label: {
                      fontSize: '18px'
                    }
                  }}
                  {...form.getInputProps('operatorId')}
                />
                <TextInput
                  label="USER NAME"
                  placeholder="ENTER USER NAME"
                  w={'50%'}
                  withAsterisk
                  styles={{
                    input: {
                      borderColor: '#737373',
                      backgroundColor: '#F5F5F5',
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#3F3F47'
                    },
                    label: {
                      fontSize: '18px'
                    }
                  }}
                  {...form.getInputProps('username')}
                />
              </Flex>
              <Flex columnGap={24}>
                <Flex w={'50%'} direction={'column'}>
                  <PasswordInput
                    label="PASSWORD"
                    placeholder="ENTER PASSWORD"
                    withAsterisk
                    styles={{
                      input: {
                        borderColor: '#737373',
                        backgroundColor: '#F5F5F5',
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#3F3F47'
                      },
                      label: {
                        fontSize: '18px'
                      }
                    }}
                    visibilityToggleIcon={VisibilityToggleIcon}
                    {...form.getInputProps('password')}
                  />
                  <PasswordInput
                    label="CONFIRM PASSWORD"
                    placeholder="CONFIRM PASSWORD"
                    withAsterisk
                    styles={{
                      input: {
                        borderColor: '#737373',
                        backgroundColor: '#F5F5F5',
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#3F3F47'
                      },
                      label: {
                        fontSize: '18px'
                      }
                    }}
                    visibilityToggleIcon={VisibilityToggleIcon}
                    {...form.getInputProps('confirmPassword')}
                  />
                </Flex>
                <Flex w={'50%'}>
                  <Select
                    label="USER ROLE"
                    placeholder="SELECT USER ROLE"
                    w={'100%'}
                    withAsterisk
                    data={
                      userDetails?.userRole === UserRole.SUPER_ADMIN
                        ? USER_ROLE
                        : userDetails?.userRole === UserRole.ADMIN
                          ? USER_ROLE.filter((role) => role.value !== UserRole.SUPER_ADMIN)
                          : userDetails?.userRole === UserRole.OPERATOR
                            ? USER_ROLE.filter((role) => role.value === UserRole.OPERATOR)
                            : []
                    }
                    styles={{
                      input: {
                        borderColor: '#737373',
                        backgroundColor: '#F5F5F5',
                        fontSize: '20px',
                        fontWeight: 600,
                        color: '#3F3F47'
                      },
                      label: {
                        fontSize: '18px'
                      }
                    }}
                    {...form.getInputProps('userRole')}
                  />
                </Flex>
              </Flex>
            </Flex>
            <Divider my={16} />
            <Flex direction="column">
              <Text size="xl" fw={600} c="#F5F5F5">
                PERMISSION:
              </Text>
              <Flex columnGap={36} mt={12}>
                <Flex columnGap={8} align="center">
                  <Checkbox
                    checked={form.values.autoMode}
                    readOnly
                    tabIndex={-1}
                    {...form.getInputProps('autoMode', { type: 'checkbox' })}
                  />
                  <Text size="lg" fw={600} c="#F5F5F5">
                    AUTO MODE
                  </Text>
                </Flex>

                <Flex columnGap={8} align="center">
                  <Checkbox {...form.getInputProps('modelConfig', { type: 'checkbox' })} />
                  <Text size="lg" fw={600} c="#F5F5F5">
                    MODEL CONFIG
                  </Text>
                </Flex>
                <Flex columnGap={8} align="center">
                  <Checkbox {...form.getInputProps('loginConfig', { type: 'checkbox' })} />
                  <Text size="lg" fw={600} c="#F5F5F5">
                    LOGIN CONFIG
                  </Text>
                </Flex>
                <Flex columnGap={8} align="center">
                  <Checkbox {...form.getInputProps('reports', { type: 'checkbox' })} />
                  <Text size="lg" fw={600} c="#F5F5F5">
                    REPORTS
                  </Text>
                </Flex>
                <Flex columnGap={8} align="center">
                  <Checkbox {...form.getInputProps('manual', { type: 'checkbox' })} />
                  <Text size="lg" fw={600} c="#F5F5F5">
                    MANUAL
                  </Text>
                </Flex>
                <Flex columnGap={8} align="center">
                  <Checkbox {...form.getInputProps('cycleReset', { type: 'checkbox' })} />
                  <Text size="lg" fw={600} c="#F5F5F5">
                    COUNT RESET
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            <Flex justify="flex-end" columnGap={12} mt={12}>
              <Button
                onClick={() => {
                  form.reset()
                }}
                variant="gradient"
                gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
                style={{ border: '1px solid #525252' }}
              >
                <Text size="lg" fw={600} c="#E5E5E5">
                  RESET
                </Text>
              </Button>
              <Button
                type="submit"
                variant="gradient"
                gradient={{ from: '#F27B48', to: '#B4522E', deg: 180 }}
              >
                <Text size="lg" fw={600} c="#E5E5E5">
                  CREATE USER
                </Text>
              </Button>
            </Flex>
          </Flex>
        </form>
      </Modal>
      <Modal
        opened={viewOpened}
        onClose={() => {
          closeView()
          form.reset()
          setIsEditing(false)

          setResetPassword(false)
        }}
        title="USER DETAILS"
        size="900"
      >
        <form
          onSubmit={form.onSubmit(() => {
            if (form.isValid()) {
              modals.openContextModal({
                modal: 'demonstration',
                title: 'SAVE CHANGES?',
                innerProps: {
                  modalBody: 'DO YOU WANT TO SAVE THE UPDATED DETAILS?',
                  buttonText: 'SAVE',
                  function: () => {
                    handleEditChanges()
                  }
                }
              })
            }
          })}
        >
          <Flex direction="column">
            <Flex direction="column" rowGap={16}>
              <Flex columnGap={24}>
                <TextInput
                  label="OPERATOR ID"
                  placeholder="ENTER OPERATOR ID"
                  w={'50%'}
                  withAsterisk
                  disabled={!isEditing}
                  styles={{
                    input: {
                      borderColor: '#737373',
                      backgroundColor: '#F5F5F5',
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#3F3F47'
                    },
                    label: {
                      fontSize: '18px'
                    }
                  }}
                  {...form.getInputProps('operatorId')}
                />
                <TextInput
                  label="USER NAME"
                  placeholder="ENTER USER NAME"
                  w={'50%'}
                  disabled={!isEditing}
                  withAsterisk
                  styles={{
                    input: {
                      borderColor: '#737373',
                      backgroundColor: '#F5F5F5',
                      fontSize: '20px',
                      fontWeight: 600,
                      color: '#3F3F47'
                    },
                    label: {
                      fontSize: '18px'
                    }
                  }}
                  {...form.getInputProps('username')}
                />
              </Flex>
              <Select
                label="USER ROLE"
                placeholder="SELECT USER ROLE"
                w={'49%'}
                disabled={!isEditing}
                withAsterisk
                data={
                  userDetails?.userRole === UserRole.SUPER_ADMIN
                    ? USER_ROLE
                    : userDetails?.userRole === UserRole.ADMIN
                      ? USER_ROLE.filter((role) => role.value !== UserRole.SUPER_ADMIN)
                      : userDetails?.userRole === UserRole.OPERATOR
                        ? USER_ROLE.filter((role) => role.value === UserRole.OPERATOR)
                        : []
                }
                styles={{
                  input: {
                    borderColor: '#737373',
                    backgroundColor: '#F5F5F5',
                    fontSize: '20px',
                    fontWeight: 600,
                    color: '#3F3F47'
                  },
                  label: {
                    fontSize: '18px'
                  }
                }}
                {...form.getInputProps('userRole')}
              />
            </Flex>
            <Flex justify={resetPassword ? 'flex-start' : 'flex-end'}>
              {resetPassword ? (
                <Flex columnGap={24} w={'100%'} mt={24}>
                  <Flex w={'50%'} direction={'column'} rowGap={16}>
                    <PasswordInput
                      label="PASSWORD"
                      placeholder="ENTER PASSWORD"
                      withAsterisk
                      styles={{
                        input: {
                          borderColor: '#737373',
                          backgroundColor: '#F5F5F5',
                          fontSize: '20px',
                          fontWeight: 600,
                          color: '#3F3F47'
                        },
                        label: {
                          fontSize: '18px'
                        }
                      }}
                      visibilityToggleIcon={VisibilityToggleIcon}
                      {...form.getInputProps('password')}
                    />
                    <PasswordInput
                      label="CONFIRM PASSWORD"
                      placeholder="CONFIRM PASSWORD"
                      withAsterisk
                      styles={{
                        input: {
                          borderColor: '#737373',
                          backgroundColor: '#F5F5F5',
                          fontSize: '20px',
                          fontWeight: 600,
                          color: '#3F3F47'
                        },
                        label: {
                          fontSize: '18px'
                        }
                      }}
                      visibilityToggleIcon={VisibilityToggleIcon}
                      {...form.getInputProps('confirmPassword')}
                    />
                  </Flex>
                  <Flex w={'50%'} />
                </Flex>
              ) : (
                <>
                  {isEditing && (
                    <Text
                      size="xl"
                      fw={600}
                      mt={12}
                      c="#F27B48"
                      onClick={() => {
                        if (isEditing) {
                          setResetPassword(true)
                        }
                      }}
                    >
                      RESET PASSWORD
                    </Text>
                  )}
                </>
              )}
            </Flex>
            <Divider my={16} />
            <Flex direction="column">
              <Text size="xl" fw={600} c="#F5F5F5">
                PERMISSION:
              </Text>
              <Flex columnGap={36} mt={12}>
                <Flex columnGap={8} align="center">
                  <Checkbox
                    checked={form.values.autoMode}
                    readOnly
                    disabled={!isEditing}
                    tabIndex={-1}
                    {...form.getInputProps('autoMode', { type: 'checkbox' })}
                  />
                  <Text size="lg" fw={600} c="#F5F5F5">
                    AUTO MODE
                  </Text>
                </Flex>

                <Flex columnGap={8} align="center">
                  <Checkbox
                    {...form.getInputProps('modelConfig', { type: 'checkbox' })}
                    disabled={!isEditing}
                  />
                  <Text size="lg" fw={600} c="#F5F5F5">
                    MODEL CONFIG
                  </Text>
                </Flex>
                <Flex columnGap={8} align="center">
                  <Checkbox
                    {...form.getInputProps('loginConfig', { type: 'checkbox' })}
                    disabled={!isEditing}
                  />
                  <Text size="lg" fw={600} c="#F5F5F5">
                    LOGIN CONFIG
                  </Text>
                </Flex>
                <Flex columnGap={8} align="center">
                  <Checkbox
                    {...form.getInputProps('reports', { type: 'checkbox' })}
                    disabled={!isEditing}
                  />
                  <Text size="lg" fw={600} c="#F5F5F5">
                    REPORTS
                  </Text>
                </Flex>
                <Flex columnGap={8} align="center">
                  <Checkbox
                    {...form.getInputProps('manual', { type: 'checkbox' })}
                    disabled={!isEditing}
                  />
                  <Text size="lg" fw={600} c="#F5F5F5">
                    MANUAL
                  </Text>
                </Flex>
                <Flex columnGap={8} align="center">
                  <Checkbox
                    {...form.getInputProps('cycleReset', { type: 'checkbox' })}
                    disabled={!isEditing}
                  />
                  <Text size="lg" fw={600} c="#F5F5F5">
                    COUNT RESET
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            <Flex justify="flex-end" columnGap={12} mt={12}>
              {!isEditing && (
                <Button
                  variant="gradient"
                  gradient={{ from: '#F27B48', to: '#B4522E', deg: 180 }}
                  onClick={() => setIsEditing(true)}
                >
                  <Text size="lg" fw={600} c="#E5E5E5">
                    EDIT USER
                  </Text>
                </Button>
              )}
              {isEditing && (
                <Button
                  variant="gradient"
                  gradient={{ from: '#F27B48', to: '#B4522E', deg: 180 }}
                  type="submit"
                >
                  <Text size="lg" fw={600} c="#E5E5E5">
                    SAVE
                  </Text>
                </Button>
              )}
            </Flex>
          </Flex>
        </form>
      </Modal>
    </Flex>
  )
}

export default LoginConfig
