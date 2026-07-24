// components/FooterBar.jsx
import { ActionIcon, Button, Divider, Flex, Image, Indicator, Menu } from '@mantine/core'
import Logo1 from '../assets/logo1.png'
import Logo2 from '../assets/logo2.png'
import { useEffect, useState } from 'react'
import moment from 'moment'
import {
  IconChevronCompactUp,
  IconFileText,
  IconLogout,
  IconMessageCircle,
  IconPhoto,
  IconRefresh,
  IconSettings,
  IconUser,
  IconXboxX
} from '@tabler/icons-react'
import { useGlobalContext } from '../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import { useLocation, useNavigate } from 'react-router-dom'
import { BodyTextMedium, BodyTextSemiBold, CaptionTextSemiBold } from '../components/AllText/Text'
import { useDisclosure } from '@mantine/hooks'
import { ExitModal } from '../components/Modals/ExitModal'

export default function FooterBar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { userDetails, setSessionUser, connectAllWs, heartBeatStatus, readValueFromPlc } =
    useGlobalContext()
  const currentPath = location.pathname
  const [opened, { open, close }] = useDisclosure(false)

  // Function to check if user has permission for a specific route
  const hasPermission = (permissionKey: string) => {
    if (!userDetails) return false
    return userDetails[permissionKey as keyof typeof userDetails] === true
  }

  const menuItems = [
    {
      label: 'AUTO MODE',
      path: '/auto-mode',
      icon: <IconSettings size={16} />,
      permission: 'autoMode'
    },
    {
      label: 'MANUAL TESTING',
      path: '/manual',
      icon: <IconMessageCircle size={16} />,
      permission: 'manual'
    },
    {
      label: 'MODEL CONFIG',
      path: '/model-config',
      icon: <IconPhoto size={16} />,
      permission: 'modelConfig'
    },
    {
      label: 'LOGIN CONFIG',
      path: '/login-config',
      icon: <IconUser size={16} />,
      permission: 'loginConfig'
    },
    {
      label: 'REPORTS',
      path: '/reports',
      icon: <IconFileText size={16} />,
      permission: 'reports'
    }
  ]

  // Filter menu items based on user permissions
  const filteredMenuItems = menuItems.filter((item) => hasPermission(item.permission))

  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(interval) // Clean up the interval on component unmount
  }, [])

  // Find the active menu item
  const activeMenuItem = filteredMenuItems.find((item) => currentPath.startsWith(item.path)) || {
    label: 'MAIN MENU'
  }

  return (
    <Flex
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#1a1a1a',
        color: '#fff',
        padding: '10 20px',
        zIndex: 1000,
        borderTop: '1px solid #333'
      }}
      pl={24}
      pr={24}
      justify="space-between"
      align="center"
    >
      <Flex>
        <Menu shadow="md" width={220}>
          <Menu.Target>
            <Button
              w={180}
              rightSection={<IconChevronCompactUp />}
              variant="gradient"
              gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
              style={{ border: '1px solid #525252' }}
              disabled={!!readValueFromPlc('M1907')}
            >
              {activeMenuItem.label}
            </Button>
          </Menu.Target>

          <Menu.Dropdown w={180}>
            {filteredMenuItems.map((item) => {
              const isActive = currentPath === item.path

              return (
                <Menu.Item
                  key={item.path}
                  leftSection={item.icon}
                  onClick={() => {
                    if (!isActive) navigate(item.path)
                  }}
                  style={{
                    fontWeight: isActive ? 700 : 400,
                    color: isActive ? '#FF6B00' : '#ffffff',
                    backgroundColor: isActive ? '#1f1f1f' : 'transparent'
                  }}
                >
                  {item.label}
                </Menu.Item>
              )
            })}
          </Menu.Dropdown>
        </Menu>
      </Flex>
      <Flex align="center" columnGap={16}>
        <Flex align="center" columnGap={8}>
          <BodyTextMedium color="#F7F2F8">PLC</BodyTextMedium>
          <Flex
            p={12}
            bg="#0A0A0A"
            style={{ borderRadius: '8px' }}
            align="center"
            columnGap={18}
            pr={12}
            h={28}
          >
            <CaptionTextSemiBold color={heartBeatStatus ? '#00C950' : '#FB2C36'} mt={4}>
              {heartBeatStatus ? 'CONNECTED' : 'NOT CONNECTED'}
            </CaptionTextSemiBold>
            <Indicator color={heartBeatStatus ? '#00C950' : '#FB2C36'} size={12} />
          </Flex>
        </Flex>
        <ActionIcon
          onClick={connectAllWs}
          h={36}
          w={50}
          bg="#262626"
          style={{ borderRadius: '6px', border: '1px solid #737373' }}
        >
          <IconRefresh />
        </ActionIcon>
        {/*  #TODO : LOGS */}
        {/* <Divider orientation="vertical" /> */}
        {/* <Flex columnGap={12} align="center">
          <Button
            variant="gradient"
            gradient={{ from: "#3B3B3B", to: "#262626", deg: 180 }}
            style={{ border: "1px solid #525252" }}
            leftSection={<IconClipboardList />}
            // onClick={() => navigate("/logs")}
          >
            <BodyTextSemiBold>LOGS</BodyTextSemiBold>
          </Button>
        </Flex> */}
        <Divider orientation="vertical" />
        <Flex columnGap={12} align="center" w={240} justify="center">
          <BodyTextSemiBold>
            {moment(currentTime).format('DD MMMM YYYY • HH:mm:ss')}
          </BodyTextSemiBold>
        </Flex>
        <Divider orientation="vertical" />
        <Flex columnGap={12} align="center">
          <BodyTextSemiBold>{userDetails?.userName}</BodyTextSemiBold>
          <Divider orientation="vertical" />
          <Button
            h={36}
            w={120}
            variant="gradient"
            aria-label="Gradient action icon"
            gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
            style={{ border: '1px solid #525252' }}
            leftSection={<IconLogout size={20} />}
            onClick={() => {
              setSessionUser(null)
              navigate('/login')
            }}
          >
            <BodyTextSemiBold>LOGOUT</BodyTextSemiBold>
          </Button>
          <Button
            h={36}
            w={96}
            variant="gradient"
            gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
            style={{ border: '1px solid #525252' }}
            onClick={open}
            leftSection={<IconXboxX color="#FF6467" />}
          >
            <BodyTextSemiBold color="#FF6467">EXIT</BodyTextSemiBold>
          </Button>
          <ExitModal opened={opened} onClose={close} onExitClose={close} />
        </Flex>
        <Divider orientation="vertical" />
        <Flex align="center">
          <Image src={Logo2} alt="Partner" />
        </Flex>
        <Divider orientation="vertical" />
        <Flex align="center">
          <Image src={Logo1} alt="Paveway" />
        </Flex>
      </Flex>
    </Flex>
  )
}
