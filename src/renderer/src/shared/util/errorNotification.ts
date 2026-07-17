import { notifications } from '@mantine/notifications'

export const errorNotification = ({ title, message }: { title: string; message: string }) => {
  notifications.show({
    title,
    message,
    color: '#B91C1C',
    position: 'top-right'
  })
}
