import React, {Component} from 'react'
import {Stage, Layer, Rect, Line} from 'react-konva'

import FlexRect from './FlexRect'
import FlexPoly from './FlexPoly'

let shapeId = 0

const heldKeys = new Set()
window.addEventListener('keydown', (event) => heldKeys.add(event.key))
window.addEventListener('keyup', (event) => heldKeys.delete(event.key))

const DEFAULT_POINTS = [90, 24, 30, 8, 43, 51, 74, 38]
const DEFAULT_POS = {x: 100, y: 100}

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shapes: [],
      selectedId: null
    }
    this.createFlexRect = this.createFlexRect.bind(this)
    this.createFlexPoly = this.createFlexPoly.bind(this)
    this.selectShape = this.selectShape.bind(this)
  }
  createFlexRect () {
    const shapes = [...this.state.shapes]
    const id = shapeId++
    shapes.push(
      <FlexRect
        key={id} id={id}
        {...DEFAULT_POS}
        width={50} height={50}
        heldKeys={heldKeys}
        selected={false}
        onClick={this.selectShape}
      />
    )
    this.setState({shapes})
  }
  createFlexPoly () {
    const shapes = [...this.state.shapes]
    const id = shapeId++
    shapes.push(
      <FlexPoly
        key={id} id={id}
        {...DEFAULT_POS}
        points={[...DEFAULT_POINTS]}
        heldKeys={heldKeys}
        selected={false}
        onClick={this.selectShape}
      />
    )
    this.setState({shapes})
  }
  selectShape (event) {
    const {shapes, selectedId} = this.state
    const id = event.target.id
    shapes.find(i => i.key === id).props.selected = true
    shapes.find(i => i.key === id).props.selected = true

  }
  render () {
    console.log(this.state.shapes)
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        <Layer>
          <Rect
            x={10} y={10} width={50} height={50} fill="#EEEEEE" shadowBlur={5}
            onClick={this.createFlexRect}
          />
          <Line
            x={70} y={10} points={[...DEFAULT_POINTS]} fill="#EEEEEE" closed={true} shadowBlur={5}
            onClick={this.createFlexPoly}
          />
          {this.state.shapes}
        </Layer>
      </Stage>
    )
  }
}
