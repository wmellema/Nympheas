import React, {Component} from 'react'
import {Stage, Layer, Rect, Line} from 'react-konva'

import FlexRect from './FlexRect'
import FlexPoly from './FlexPoly'

const background = 'http://prints.mikeschley.com/img/s/v-3/p568099269-4.jpg'

let shapeId = 0

const heldKeys = new Set()
window.addEventListener('keydown', (event) => heldKeys.add(event.key))
window.addEventListener('keyup', (event) => heldKeys.delete(event.key))

const DEFAULT_POINTS = [90, 24, 30, 8, 43, 51, 74, 38]
const DEFAULT_POS = {x: 100, y: 100}

function imgFrom (url) {
  const img = new Image()
  img.src = url
  return img
}

export default class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      shapes: [],
      selectedShape: null
    }
    this.selectShape = this.selectShape.bind(this)
    this.deselectShape = this.deselectShape.bind(this)
    this.keyListener = this.keyListener.bind(this)
  }
  componentDidMount () {
    window.addEventListener('keypress', this.keyListener)
  }
  componentWillUnmount () {
    window.removeEventListener('keypress', this.keyListener)
  }
  keyListener (event) {
    switch (event.key) {
      case 'Delete': return this.destroyShape()
      default: // do nothing
    }
  }
  createShape (type) {
    const shapes = [...this.state.shapes]
    shapes.push({
      type,
      id: `${shapeId++}`,
      selected: false
    })
    this.setState({shapes})
  }
  selectShape (event) {
    const {shapes, selectedShape} = this.state
    if (selectedShape) selectedShape.selected = false
    const shape = shapes.find(i => i.id === event.target.name())
    shape.selected = true
    this.setState({
      selectedShape: shape,
      shapes
    })
  }
  deselectShape (event) {
    if (heldKeys.size) return
    const mousePoint = {x: event.evt.layerX, y: event.evt.layerY}
    const intersect = !!this.shapesLayer.getIntersection(mousePoint)

    if (intersect) return
    const {shapes, selectedShape} = this.state
    if (selectedShape) selectedShape.selected = false
    this.setState({
      selectedShape: null,
      shapes
    })
  }
  destroyShape () {
    let {shapes, selectedShape} = this.state
    if (!selectedShape) return
    shapes = [...shapes]
    shapes.splice(shapes.indexOf(selectedShape), 1)
    selectedShape = null
    this.setState({shapes, selectedShape})
  }
  render () {
    const shapes = this.state.shapes.map((v) => {
      switch (v.type) {
        case 'FlexRect': return (
          <FlexRect
            key={v.id} name={v.id}
            {...DEFAULT_POS}
            width={50} height={50}
            selected={v.selected}
            heldKeys={heldKeys}
            onMouseDown={this.selectShape}
          />
        )
        case 'FlexPoly': return (
          <FlexPoly
            key={v.id} name={v.id}
            {...DEFAULT_POS}
            points={[...DEFAULT_POINTS]}
            selected={v.selected}
            heldKeys={heldKeys}
            backgroundLayer={this.backgroundLayer} // FlexPoly needs this ref to listen for clicks outside itself
            onMouseDown={this.selectShape}
          />
        )
        default: return null
      }
    })
    const img = imgFrom(background)
    return (
      <Stage
        width={img.width} height={img.height}
        onClick={this.deselectShape}
      >
        <Layer ref={(ref) => this.backgroundLayer = ref}>
          <Rect
            width={img.width} height={img.height}
            fillPatternImage={img}
          />
        </Layer>
        <Layer ref={(ref) => this.shapesLayer = ref}>
          <Rect
            x={10} y={10} width={50} height={50} fill="#EEEEEE" shadowBlur={5}
            onClick={() => this.createShape('FlexRect')}
          />
          <Line
            x={70} y={10} points={[...DEFAULT_POINTS]} fill="#EEEEEE"
            closed={true} shadowBlur={5}
            onClick={() => this.createShape('FlexPoly')}
          />
          {shapes}
        </Layer>
      </Stage>
    )
  }
}
