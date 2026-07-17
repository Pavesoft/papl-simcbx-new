// ReturnButton.tsx
import React from 'react'
import { ActionIcon } from '@mantine/core'
import { IconArrowLeft } from '@tabler/icons-react'

type ReturnButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const ReturnButton = ({ onClick }: ReturnButtonProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}
    >
      <ActionIcon radius={4} w={52} h={40} bg="#F27B4833" c="#F27B48" onClick={onClick}>
        <IconArrowLeft size={20} />
      </ActionIcon>
    </div>
  )
}

export default ReturnButton
