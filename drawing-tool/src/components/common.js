import React from 'react'
import {Rect} from 'react-konva'

export const Anchor = (props) =>
  <Rect
    cornerRadius={5} fill="#FFFFFF" shadowBlur={5} draggable={true}
    width={10} height={10} offsetX={5} offsetY={5} {...props}
  />
