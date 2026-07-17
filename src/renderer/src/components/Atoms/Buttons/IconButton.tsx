// ForwardButton.tsx
import React from 'react'
import { ActionIcon, rem } from '@mantine/core'

type ReturnButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}
const IconButton = ({ onClick }: ReturnButtonProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: rem(12)
      }}
    >
      {/* Button */}
      <ActionIcon
        radius={4}
        w={52}
        h={40}
        variant="gradient"
        aria-label="Gradient action icon"
        gradient={{ from: '#414344', to: '#2B2D2E', deg: 145 }}
        style={{
          boxShadow: '3px 6px 10px #1212128e, -3px -6px 10px #2a2a2a',
          border: '1px solid #2f2f2f',
          transition: 'all 0.2s ease'
        }}
        className="return-action-icon"
        onClick={onClick}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
        </svg>
      </ActionIcon>
    </div>
  )
}

export default IconButton
