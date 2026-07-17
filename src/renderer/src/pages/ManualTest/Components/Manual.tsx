import { ActionIcon, Flex } from '@mantine/core'
import CylinderTest from '../../../components/Atoms/CylinderTest'
import CheckComponent from '../../../components/Atoms/CheckComponent'
import ServoPositionComponent from '../../../components/Atoms/ServoPositionComponent'
import CameraComponent from '../../../components/Atoms/CameraComponent'
import StatusSingleButtonComponent from '../../../components/Atoms/StatusSingleButtonComponent'
import SpeedPositionComponent from '../../../components/Atoms/SpeedPositionComponent'
import ServoErrorComponent from '../../../components/Atoms/ServoErrorComponent'
import Jog from '../../../components/Atoms/Jog'
import SingleButtonComponent from '../../../components/Atoms/SingleButtonComponent'
import { HeadingMediumSemiBold, HeadingSmallSemiBold } from '../../../components/AllText/Text'
import { IconArrowRight } from '@tabler/icons-react'
import { useGlobalContext } from '../../../shared/ContextProviders/GlobalContextProvider/GlobalContextProvider'
import ActualPosition from '../../../components/Atoms/PositionComponent'
import { ModelSelect } from '../../../components/ModelSelect'

const Manual = () => {
  const { writeMultipleValuesToPlc } = useGlobalContext()
  return (
    <Flex direction={'column'} bg="#0a0a0a">
      <Flex pl={20}>
        <ModelSelect />
      </Flex>
      <Flex columnGap={20} bg="#0a0a0a" p={20}>
        <Flex w={'25%'} direction={'column'} rowGap={12}>
          <Flex direction={'column'}>
            <Flex bg="#262626" w={'100%'} style={{ borderRadius: '8px 8px 0px 0px' }}>
              <HeadingMediumSemiBold color="#F0E9F1" pl={16} pt={4} pb={4}>
                STAGE 2
              </HeadingMediumSemiBold>
            </Flex>
            <Flex
              style={{ borderRadius: '0px 0px 8px 8px ' }}
              bg="#171717"
              w={'100%'}
              direction="column"
              rowGap={16}
              pt={16}
              pb={16}
            >
              {/* Done */}

              <CylinderTest
                label="PROBE CYL 1"
                writeAddress="M1002"
                reedFwdAddress="X12"
                reedRetAddress="X13"
                opHealthAddress="M1003"
              />
              {/* Done */}
              <CylinderTest
                label="PROBE CYL 2"
                writeAddress="M1004"
                reedFwdAddress="X14"
                reedRetAddress="X15"
                opHealthAddress="M1005"
              />
              {/* Done */}

              <CheckComponent
                label="RESISTANCE CHECK"
                writeAddress="M1006"
                opHealthAddress="M1007"
                lowWordAddress="D2200"
                highWordAddress="D2201"
                unit="mΩ"
              />
            </Flex>
          </Flex>
          {/* STAGE 4 */}
          <Flex direction={'column'}>
            <Flex bg="#262626" w={'100%'} style={{ borderRadius: '8px 8px 0px 0px' }}>
              <HeadingMediumSemiBold color="#F0E9F1" pl={16} pt={4} pb={4}>
                STAGE 4
              </HeadingMediumSemiBold>
            </Flex>
            <Flex
              style={{ borderRadius: '0px 0px 8px 8px ' }}
              bg="#171717"
              w={'100%'}
              direction="column"
              rowGap={16}
              pt={16}
              pb={16}
            >
              {/* Done */}
              <CylinderTest
                label="CB1 CLAMP CYL"
                writeAddress="M1018"
                reedFwdAddress="X26"
                reedRetAddress="X27"
                opHealthAddress="M1019"
              />
              {/* Done */}
              <CylinderTest
                label="CB1 LOAD CELL CYL"
                writeAddress="M1020"
                reedFwdAddress="X100"
                reedRetAddress="X101"
                opHealthAddress="M1021"
              />
              {/* Done */}
              <ServoPositionComponent
                label="SERVO SLIDE POSITION"
                opHealthAddress="M1023"
                initialWriteAddress="M1022"
                pressWriteAddress="M1025"
                loadWriteAddress="M1024"
                homeWriteAddress="M1026"
              />
              <Flex pl={12} direction="column">
                <SpeedPositionComponent
                  positionLowWordAddress="D3000"
                  positionHighWordAddress="D3001"
                  speedLowWordAddress="D3002"
                  speedHighWordAddress="D3003"
                  goBtnWriteAddress="M1029"
                />
                <ActualPosition
                  label="ACTUAL POSITION"
                  unit="mm"
                  word="two"
                  positionLowWordAddress="D3100"
                  positionHighWordAddress="D3101"
                />
                <ActualPosition label="ACTUAL LOAD" unit="N" word="one" wordAddress="D3116" />
                <Jog jogPlusWriteAddress="M1027" jogMinusWriteAddress="M1028" />
                <Flex mt={20} />
                <ServoErrorComponent label=" SERVO ERROR CODE" errorAddress="D3108" />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex w={'25%'} direction={'column'} rowGap={12}>
          <Flex direction={'column'}>
            <Flex bg="#262626" w={'100%'} style={{ borderRadius: '8px 8px 0px 0px' }}>
              <HeadingMediumSemiBold color="#F0E9F1" pl={16} pt={4} pb={4}>
                STAGE 3
              </HeadingMediumSemiBold>
            </Flex>
            <Flex
              style={{ borderRadius: '0px 0px 8px 8px ' }}
              bg="#171717"
              w={'100%'}
              direction="column"
              // style={{ border: "1px solid #ccc" }}
              rowGap={16}
              pt={16}
              pb={16}
            >
              {/* Done */}
              <CylinderTest
                label="PROBE CYL 1"
                writeAddress="M1010"
                reedFwdAddress="X20"
                reedRetAddress="X21"
                opHealthAddress="M1011"
              />
              {/* Done */}
              <CylinderTest
                label="PROBE CYL 2"
                writeAddress="M1012"
                reedFwdAddress="X22"
                reedRetAddress="X23"
                opHealthAddress="M1013"
              />
              {/* Done */}
              <CheckComponent
                label="IMPEDANCE CHECK"
                writeAddress="M1014"
                opHealthAddress="M1015"
                highWordAddress="D2301"
                lowWordAddress="D2300"
                unit="μF"
              />
            </Flex>
          </Flex>
          <Flex direction={'column'}>
            <Flex bg="#262626" w={'100%'} style={{ borderRadius: '8px 8px 0px 0px' }}>
              <HeadingMediumSemiBold color="#F0E9F1" pl={16} pt={4} pb={4}>
                STAGE 6
              </HeadingMediumSemiBold>
            </Flex>
            <Flex
              style={{ borderRadius: '0px 0px 8px 8px ' }}
              bg="#171717"
              w={'100%'}
              direction="column"
              rowGap={16}
              pt={16}
              pb={16}
            >
              {/* Done */}
              <CylinderTest
                label="BEARING CHECK PROBE CYL"
                writeAddress="M1046"
                reedFwdAddress="X50"
                reedRetAddress="X51"
                opHealthAddress="M1047"
              />
              <CameraComponent
                componentName="CAMERA SCENE"
                cameraSceneAddress="D3013"
                opHealthAddress="M1051"
                btnCameraScene="M1045"
                btnCameraTrigger="M1044"
              />
            </Flex>
          </Flex>

          <Flex direction={'column'}>
            <Flex bg="#262626" w={'100%'} style={{ borderRadius: '8px 8px 0px 0px' }}>
              <HeadingMediumSemiBold color="#F0E9F1" pl={16} pt={4} pb={4}>
                INDEXING
              </HeadingMediumSemiBold>
            </Flex>
            <Flex
              style={{ borderRadius: '0px 0px 8px 8px ' }}
              bg="#171717"
              w={'100%'}
              direction="column"
              rowGap={16}
              pt={16}
              pb={16}
            >
              <StatusSingleButtonComponent
                label="INDEXING SERVO HOMING"
                buttonLabel="START"
                opHealthAddress="M1079"
                writeAddress="M1074"
              />

              <Flex w="100%" justify="space-between" pl={16} pr={16}>
                <Flex align="center" columnGap={12} pl={12}>
                  <HeadingMediumSemiBold color="#F0E9F1">INDEXING SERVO</HeadingMediumSemiBold>
                </Flex>
                <Flex>
                  <Flex columnGap={6}>
                    <Flex direction="column" rowGap={4}>
                      <ActionIcon
                        radius={4}
                        w={94}
                        h={40}
                        variant="gradient"
                        gradient={{ from: '#3B3B3B', to: '#262626', deg: 180 }}
                        style={{ border: '1px solid #525252' }}
                        onClick={() => {
                          writeMultipleValuesToPlc([{ address: 'M1075', value: true }])
                        }}
                      >
                        <IconArrowRight color="#E5E5E5" />
                      </ActionIcon>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
              <Jog jogMinusWriteAddress="M1078" jogPlusWriteAddress="M1077" />
              <Flex direction="column" pl={12}>
                <ServoErrorComponent label="INDEXER SERVO ERROR CODE" errorAddress="D3111" />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex w={'25%'} direction="column">
          <Flex direction={'column'}>
            <Flex bg="#262626" w={'100%'} style={{ borderRadius: '8px 8px 0px 0px' }}>
              <HeadingMediumSemiBold color="#F0E9F1" pl={16} pt={4} pb={4}>
                STAGE 5
              </HeadingMediumSemiBold>
            </Flex>
            <Flex
              style={{ borderRadius: '0px 0px 8px 8px ' }}
              bg="#171717"
              w={'100%'}
              direction="column"
              rowGap={16}
              pt={16}
              pb={16}
            >
              {/* Done */}
              <CylinderTest
                label="CB1 CLAMP CYL"
                writeAddress="M1030"
                reedFwdAddress="X34"
                reedRetAddress="X35"
                opHealthAddress="M1031"
              />
              {/* Done */}
              <CylinderTest
                label="CB2 LOAD CELL CYL"
                writeAddress="M1032"
                reedFwdAddress="X102"
                reedRetAddress="X103"
                opHealthAddress="M1033"
              />
              {/* Done */}
              <ServoPositionComponent
                label="SERVO SLIDE POSITION"
                initialWriteAddress="M1034"
                opHealthAddress="M1035"
                pressWriteAddress="M1037"
                loadWriteAddress="M1036"
                homeWriteAddress="M1038"
              />

              <Flex pl={12} direction="column">
                <SpeedPositionComponent
                  positionLowWordAddress="D3004"
                  positionHighWordAddress="D3005"
                  speedLowWordAddress="D3006"
                  speedHighWordAddress="D3007"
                  goBtnWriteAddress="M1041"
                />
                <ActualPosition
                  label="ACTUAL POSITION"
                  unit="mm"
                  word="two"
                  positionLowWordAddress="D3102"
                  positionHighWordAddress="D3103"
                />
                <ActualPosition label="ACTUAL LOAD" unit="N" word="one" wordAddress="D3117" />
                <Jog jogMinusWriteAddress="M1040" jogPlusWriteAddress="M1039" />
                <Flex mt={20} />
                <ServoErrorComponent label="SERVO ERROR CODE" errorAddress="D3109" />
              </Flex>
              <CameraComponent
                componentName="CAMERA SCENE"
                cameraSceneAddress="D3012"
                opHealthAddress="M1080"
                btnCameraScene="M1042"
                btnCameraTrigger="M1043"
              />
            </Flex>
          </Flex>
          {/* <Flex direction={"column"}>
          <Flex bg="#262626" w={"100%"} style={{ borderRadius: "8px 8px 0px 0px" }}>
            <HeadingMediumSemiBold color="#F0E9F1" pl={16} pt={4} pb={4}>
              STAGE 7
            </HeadingMediumSemiBold>
          </Flex>
          <Flex
            style={{ borderRadius: "0px 0px 8px 8px " }}
            bg="#171717"
            w={"100%"}
            direction="column"
            rowGap={16}
            pt={16}
            pb={16}
          >
        
            <StatusSingleButtonComponent
              label="LASER MARKING"
              buttonLabel="START"
              writeAddress="M1052"
              opHealthAddress="M1053"
            />
          </Flex>
        </Flex> */}
        </Flex>
        <Flex w={'25%'} direction={'column'}>
          <Flex direction={'column'}>
            <Flex bg="#262626" w={'100%'} style={{ borderRadius: '8px 8px 0px 0px' }}>
              <HeadingMediumSemiBold color="#F0E9F1" pl={16} pt={4} pb={4}>
                STAGE 8
              </HeadingMediumSemiBold>
            </Flex>
            <Flex
              style={{ borderRadius: '0px 0px 8px 8px ' }}
              bg="#171717"
              w={'100%'}
              direction="column"
              rowGap={8}
              pt={16}
              pb={16}
            >
              {/* Done */}
              <CylinderTest
                label="GRIPPER UP/DN CYL"
                writeAddress="M1056"
                opHealthAddress="M1057"
                reedFwdAddress="X57"
                reedRetAddress="X60"
              />
              {/* Done */}
              <CylinderTest
                label="GRIPPER OP/CL CYL"
                writeAddress="M1058"
                opHealthAddress="M1059"
                reedFwdAddress="X61"
                reedRetAddress="X62"
              />
              {/* Done */}
              <StatusSingleButtonComponent
                label="SERVO SLIDE HOMING"
                buttonLabel="START"
                writeAddress="M1060"
                opHealthAddress="M1061"
              />

              <StatusSingleButtonComponent
                label="SERVO PICK POSITION"
                buttonLabel="START"
                opHealthAddress="M1061"
                writeAddress="M1062"
              />
              <Flex pl={12} direction="column" rowGap={12}>
                <HeadingSmallSemiBold color="#FCD0AE" pl={16}>
                  SERVO PLACE POSITION
                </HeadingSmallSemiBold>
                {/* Done */}
                <SingleButtonComponent
                  label="POSITION 1"
                  buttonLabel="START"
                  writeAddress="M1063"
                />
                {/* Done */}
                <SingleButtonComponent
                  label="POSITION 2"
                  buttonLabel="START"
                  writeAddress="M1064"
                />
                {/* Done */}
                <SingleButtonComponent
                  label="POSITION 3"
                  buttonLabel="START"
                  writeAddress="M1065"
                />
                {/* Done */}
                <SingleButtonComponent
                  label="POSITION 4"
                  buttonLabel="START"
                  writeAddress="M1066"
                />
                {/* Done */}
                <SingleButtonComponent
                  label="POSITION 5"
                  buttonLabel="START"
                  writeAddress="M1067"
                />
                {/* Done */}
                <SingleButtonComponent
                  label="POSITION 6"
                  buttonLabel="START"
                  writeAddress="M1068"
                />
                <SpeedPositionComponent
                  positionLowWordAddress="D3008"
                  positionHighWordAddress="D3009"
                  speedLowWordAddress="D3010"
                  speedHighWordAddress="D3011"
                  goBtnWriteAddress="M1073"
                  positionMax={800}
                  speedMax={200}
                />
                <ActualPosition
                  label="ACTUAL POSITION"
                  unit="mm"
                  word="two"
                  positionLowWordAddress="D3104"
                  positionHighWordAddress="D3105"
                />
                <Jog jogMinusWriteAddress="M1072" jogPlusWriteAddress="M1071" />
                <ServoErrorComponent label="SERVO ERROR CODE" errorAddress="D3110" />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Manual
