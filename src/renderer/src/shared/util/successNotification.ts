import { notifications } from '@mantine/notifications'

export const successNotification = ({ title, message }: { title: string; message: string }) => {
  notifications.show({
    title,
    message,
    color: '#15803D',
    position: 'top-right'
  })
}
