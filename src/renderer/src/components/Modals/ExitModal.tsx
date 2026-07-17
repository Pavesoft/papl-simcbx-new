// import { useDisclosure } from "@mantine/hooks";
import { Button, CloseButton, Flex, Modal, type ModalProps } from '@mantine/core'
import type { FC } from 'react'
import { IconAlertHexagon } from '@tabler/icons-react'
import { BodyTextSemiBold, HeadingMediumMedium } from '../AllText/Text'
import { api } from '../../api'

interface IExitModalProps extends ModalProps {
  onExitClose: () => void
}

export const ExitModal: FC<IExitModalProps> = ({ onExitClose, ...props }) => {
  return (
    <Modal withCloseButton={false} closeOnClickOutside={true} {...props}>
      <Flex direction={'column'} gap={'lg'}>
        <Flex direction={'column'}>
          <Flex align={'center'} gap={'sm'} pos={'relative'}>
            <IconAlertHexagon color={'#FF6467'} />
            <HeadingMediumMedium color={'#FF6467'}>ARE YOU SURE YOU WANT EXIT?</HeadingMediumMedium>
            <CloseButton onClick={onExitClose} pos={'absolute'} right={'0'} />
          </Flex>
          <BodyTextSemiBold color={'#E5E5E5'}>
            YOU WILL BE LOGGED OUT OF THE ENTIRE SYSTEM
          </BodyTextSemiBold>
        </Flex>
        <Button
          h={36}
          w={96}
          variant="filled"
          bg="#fb2c36"
          onClick={() => {
            sessionStorage.clear()
            api.app.exit()
          }}
        >
          <BodyTextSemiBold color="#FFF">EXIT</BodyTextSemiBold>
        </Button>
      </Flex>
    </Modal>
  )
}
