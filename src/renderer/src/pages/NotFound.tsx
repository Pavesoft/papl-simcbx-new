import { Button, Flex, Text, Title } from '@mantine/core'
import Icon from '../assets/svg/not-found.svg'
import { useNavigate } from 'react-router-dom'

const NotFound = () => {
  const navigate = useNavigate()
  return (
    <Flex direction="column" h="100vh" w="100%" justify="center" align="center" bg={'#1d1d1d'}>
      <Flex
        h={118}
        w={118}
        bg={'#404040'}
        justify="center"
        align="center"
        style={{ borderRadius: '20px' }}
        mb={28}
      >
        <img className="return-action-icon" src={Icon} alt="Resistance" />
      </Flex>
      <Flex direction="column" rowGap={8}>
        <Title c={'#F5F5F5'}>OOPS! PAGE NOT FOUND/FORBIDDEN</Title>
        <Text c={'#D4D4D4'} w={450} ta={'center'}>
          LOOKS LIKE YOU'VE ENTERED WRONG DETAILS. THE PAGE YOU'RE LOOKING FOR DOESN'T EXIST OR HAS
          BEEN MOVED
        </Text>
      </Flex>
      <Button
        type="submit"
        variant="gradient"
        gradient={{ from: '#F27B48', to: '#B4522E', deg: 180 }}
        mt={28}
        onClick={() => navigate('/auto-mode')}
      >
        <Text size="lg" fw={600} c="#E5E5E5">
          GO TO AUTO MODE
        </Text>
      </Button>
    </Flex>
  )
}

export default NotFound
