import React, {Component} from 'react'
import {Stage, Layer} from 'react-konva'

import FlexRect from './FlexRect'
import FlexPoly from './FlexPoly'

const heldKeys = new Set()
window.addEventListener('keydown', (event) => heldKeys.add(event.key))
window.addEventListener('keyup', (event) => heldKeys.delete(event.key))

export default class App extends Component {
  render () {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <FlexRect x={100} y={100} width={50} height={50} heldKeys={heldKeys} />
          <FlexRect x={200} y={200} width={40} height={30} heldKeys={heldKeys} />
          <FlexPoly x={250} y={250} corners={5} size={400} heldKeys={heldKeys} />
        </Layer>
      </Stage>
    )
  }
}
