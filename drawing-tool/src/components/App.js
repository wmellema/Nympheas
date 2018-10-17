import React, {Component} from 'react'
import {Stage, Layer} from 'react-konva'
import Konva from 'konva'

import FlexRect from './FlexRect'
import FlexPoly from './FlexPoly'

const grc = Konva.Util.getRandomColor

export default class App extends Component {
  render () {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <FlexRect x={100} y={100} width={50} height={50} fill={grc()} />
          <FlexRect x={200} y={200} width={40} height={30} fill={grc()} />
          <FlexPoly x={250} y={250} corners={5} size={400} fill={grc()} />
        </Layer>
      </Stage>
    )
  }
}
