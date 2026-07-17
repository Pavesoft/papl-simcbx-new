// ResistanceButton.tsx
import { ActionIcon, rem } from '@mantine/core'
import resistanceActiveIcon from '../../../assets/svg/resistance-active.svg'

type ReturnButtonProps = {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}
const ResistanceButton = ({ onClick }: ReturnButtonProps) => {
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
        <img
          className="return-action-icon"
          src={resistanceActiveIcon}
          alt="Resistance"
          width={24}
          height={24}
        />
      </ActionIcon>
    </div>
  )
}

export default ResistanceButton
