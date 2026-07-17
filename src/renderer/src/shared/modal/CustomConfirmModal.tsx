import { Button, Flex, Text } from '@mantine/core'
import type { ContextModalProps } from '@mantine/modals'

export const CustomConfirmModal = ({
  context,
  id,
  innerProps
}: ContextModalProps<{
  modalBody: string
  buttonText: string
  function: () => void
  buttonColor?: string
}>) => (
  <>
    <Text size="sm">{innerProps.modalBody}</Text>

    {/* Flex container to align button to the right */}
    <Flex justify="flex-end" mt="md" w="100%">
      <Button
        variant="gradient"
        gradient={{ from: '#F27B48', to: '#B4522E', deg: 180 }}
        onClick={() => {
          innerProps.function()
          context.closeModal(id)
        }}
        style={{
          backgroundColor: innerProps.buttonColor || 'primary.8'
        }}
      >
        {innerProps.buttonText}
      </Button>
    </Flex>
  </>
)
