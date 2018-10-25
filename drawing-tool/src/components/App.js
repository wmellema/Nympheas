import React, {Component, Fragment} from 'react'
import {Stage, Layer, Rect, Line} from 'react-konva'

import {openModal} from '../modals'
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
    this.openImportDialog = this.openImportDialog.bind(this)
    this.openExportDialog = this.openExportDialog.bind(this)
    this.shapeRefs = new Map()
    // this.state.shapes holds minimal descriptions of shapes to be rendered.
    // this.shapeRefs holds refs to the wrapper components, so their state can
    // be read for the purpose of serialization.
    // cycle:
    // 1. update this.state.shapes
    // 2. rerender
    // 3. update this.shapeRefs
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
      attrs: {},
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
    if (heldKeys.size || event.target.name() !== 'Background') return
    // const mousePoint = {x: event.evt.layerX, y: event.evt.layerY}
    // const intersect = !!this.shapesLayer.getIntersection(mousePoint)
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
    this.shapeRefs.delete(selectedShape.id)
    selectedShape = null
    this.setState({shapes, selectedShape})
  }
  openImportDialog () {
    openModal({
      // title: 'Import',
      type: 'input',
      message: 'Paste your JSON:'
    }).then(({result, data}) => {
      if (result === 'ok') this.importShapes(data)
    })
  }
  openExportDialog () {
    openModal({
      // title: 'Export',
      type: 'output',
      message: 'Copy and save your JSON:',
      output: this.serializeShapes()
    })
  }
  serializeShapes () {
    const arr = []
    for (const s of this.state.shapes) {
      const attrs = this.shapeRefs.get(s.id).state
      arr.push({
        // id: s.id,
        type: s.type,
        attrs: Object.assign({}, attrs)
      })
    }
    return JSON.stringify(arr)
  }
  importShapes (unparsedData) {
    let data
    try { data = JSON.parse(unparsedData) }
    catch (err) { alert('Your JSON is invalid!') }
    for (const s of this.state.shapes) this.shapeRefs.delete(s.id)
    const shapes = []
    for (const s of data) {
      shapes.push({
        type: s.type,
        attrs: s.attrs,
        id: `${shapeId++}`,
        selected: false
      })
    }
    this.setState({
      shapes,
      selectedShape: null
    })
  }
  render () {
    const shapes = this.state.shapes.map((v) => {
      switch (v.type) {
        case 'Rect': return (
          <FlexRect
            key={v.id} name={v.id}
            x={v.attrs.x || DEFAULT_POS.x} y={v.attrs.y || DEFAULT_POS.y}
            width={v.attrs.width || 50} height={v.attrs.height || 50}
            fill={v.attrs.fill}
            selected={v.selected}
            heldKeys={heldKeys}
            onMouseDown={this.selectShape}
            ref={(ref) => this.shapeRefs.set(v.id, ref)}
          />
        )
        case 'Poly': return (
          <FlexPoly
            key={v.id} name={v.id}
            x={v.attrs.x || DEFAULT_POS.x} y={v.attrs.y || DEFAULT_POS.y}
            points={v.attrs.points || [...DEFAULT_POINTS]}
            fill={v.attrs.fill}
            selected={v.selected}
            heldKeys={heldKeys}                    //    FlexPoly needs this ref
            backgroundLayer={this.backgroundLayer} // <- to listen for clicks
            onMouseDown={this.selectShape}         //    outside itself
            ref={(ref) => this.shapeRefs.set(v.id, ref)}
          />
        )
        default: return null
      }
    })
    const img = imgFrom(background)
    return (
      <Fragment>
        <button onClick={this.openImportDialog}>Import</button>
        <button onClick={this.openExportDialog}>Export</button>
        <Stage
          width={img.width} height={img.height}
          onClick={this.deselectShape}
        >
          <Layer ref={(ref) => this.backgroundLayer = ref}>
            <Rect
              name="Background"
              width={img.width} height={img.height}
              fillPatternImage={img}
            />
          </Layer>
          <Layer ref={(ref) => this.shapesLayer = ref}>
            <Rect
              x={10} y={10} width={50} height={50} fill="#EEEEEE" shadowBlur={5}
              onClick={() => this.createShape('Rect')}
            />
            <Line
              x={70} y={10} points={[...DEFAULT_POINTS]} fill="#EEEEEE"
              closed={true} shadowBlur={5}
              onClick={() => this.createShape('Poly')}
            />
            {shapes}
          </Layer>
        </Stage>
      </Fragment>
    )
  }
}
