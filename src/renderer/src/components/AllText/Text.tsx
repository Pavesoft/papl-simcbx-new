import { Text } from '@mantine/core'
import type { ReactNode } from 'react'

interface CustomTextProps {
  children?: ReactNode
  color?: string
  pl?: number
  pr?: number
  pt?: number
  pb?: number
  ml?: number
  mr?: number
  mt?: number
  mb?: number
  fw?: string
  fontSize?: number
}

export const CustomText = (props: CustomTextProps) => {
  return (
    <Text
      style={{ fontSize: props.fontSize }}
      c={props.color || '#F5F5F5'}
      fw={props.fw}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const TitleBold = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 32
  }

  return (
    <Text
      fw="700"
      style={{ ...TextStyle }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const TitleSemiBold = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 32
  }

  return (
    <Text
      fw="600"
      style={{ ...TextStyle }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const TitleMedium = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 32
  }

  return (
    <Text
      fw="500"
      style={{ ...TextStyle }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const HeadingLargeSemiBold = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 28
  }

  return (
    <Text
      fw="600"
      style={{
        ...TextStyle
      }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const HeadingLargeMedium = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 28
  }

  return (
    <Text
      fw="500"
      style={{
        ...TextStyle
      }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const HeadingMediumSemiBold = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 24
  }

  return (
    <Text
      fw="600"
      style={{
        ...TextStyle
      }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const HeadingMediumMedium = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 24
  }

  return (
    <Text
      fw="500"
      style={{
        ...TextStyle
      }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const HeadingSmallSemiBold = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 20
  }

  return (
    <Text
      fw="600"
      style={{
        ...TextStyle
      }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const HeadingSmallMedium = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 20
  }

  return (
    <Text
      fw="500"
      style={{
        ...TextStyle
      }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}

export const BodyTextRegular = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 18
  }
  return (
    <Text
      fw="400"
      style={{
        ...TextStyle
      }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const BodyTextMedium = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 18
  }
  return (
    <Text
      fw="500"
      style={{
        ...TextStyle
      }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const BodyTextSemiBold = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 18
  }
  return (
    <Text
      fw="600"
      style={{
        ...TextStyle
      }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const CaptionTextRegular = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 16
  }
  return (
    <Text
      fw="400"
      style={{
        ...TextStyle
      }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const CaptionTextMedium = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 16
  }
  return (
    <Text
      fw="500"
      style={{
        ...TextStyle
      }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
export const CaptionTextSemiBold = (props: CustomTextProps) => {
  const TextStyle = {
    fontSize: 16
  }
  return (
    <Text
      fw="600"
      style={{
        ...TextStyle
      }}
      c={props.color || '#F5F5F5'}
      pl={props.pl}
      pr={props.pr}
      pt={props.pt}
      pb={props.pb}
      ml={props.ml}
      mr={props.mr}
      mt={props.mt}
      mb={props.mb}
    >
      {props.children}
    </Text>
  )
}
