import React from 'react'
import {Circle} from 'react-konva'

export const Anchor = (props) =>
  <Circle
    fill="#FFFFFF" shadowBlur={5} draggable={true}
    width={10} {...props}
  />
