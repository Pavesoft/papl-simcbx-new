import { createTheme, MantineProvider, Modal, Switch } from '@mantine/core'
import '@mantine/dates/styles.css' //if using mantine date picker features
import 'mantine-react-table/styles.css' //make sure MRT styles were imported in your app root (once)
import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './index.css'
import AppRouter from './router/AppRouter'
import { ModalsProvider } from '@mantine/modals'
import { GlobalContextProvider } from './shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { Notifications } from '@mantine/notifications'
import { CustomConfirmModal } from './shared/modal/CustomConfirmModal'
import { RouteListener } from './RouteListener'

const theme = createTheme({
  fontFamily: 'Rajdhani, sans-serif',
  colors: {
    orange: [
      '#fff4e6',
      '#ffe8cc',
      '#ffd8a8',
      '#ffc078',
      '#ffa94d',
      '#ff922b',
      '#fd7e14',
      '#f76707',
      '#e8590c',
      '#d9480f'
    ]
  },
  primaryColor: 'orange',

  components: {
    Switch: Switch.extend({
      defaultProps: {
        color: '#F27B48'
      }
    }),
    Modal: Modal.extend({
      defaultProps: {
        centered: true,
        radius: 'md',
        overlayProps: {
          opacity: 0.8,
          bg: '#262626'
        },
        closeOnClickOutside: false,
        closeOnEscape: false
      },
      styles: {
        content: {
          backgroundColor: '#171717', // dark modal background
          border: '1px solid #525252' // orange border
        },
        header: {
          backgroundColor: '#171717' // match content bg
        },
        title: {
          color: '#FFFFFF' // white title
        }
      }
    })
  }
})

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <Notifications />
      <ModalsProvider modals={{ demonstration: CustomConfirmModal }}>
        <GlobalContextProvider>
          <RouteListener />
          <AppRouter />
        </GlobalContextProvider>
      </ModalsProvider>
    </MantineProvider>
  )
}
