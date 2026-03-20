import React from 'react'
import { ColorValue } from 'react-native'
import { s } from 'react-native-size-matters/extend'
import Svg, { Path } from 'react-native-svg'

interface IProps {
  size?: number
  color?: ColorValue
  strokeWidth?: number
}

const BackIcon = (props: IProps) => {
  const { size = 18, color = '#374151' } = props

  return (
    <Svg width={s(size)} height={s(size)} viewBox="0 0 18 18" fill="none">
    <Path d="M14.25 9H3.75M3.75 9L9 3.75M3.75 9L9 14.25" stroke={color} strokeWidth="1.875" strokeLinecap="round"/>
    </Svg>
  )
}

export default BackIcon
