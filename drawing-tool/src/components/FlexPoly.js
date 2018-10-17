import React, {PureComponent} from 'react'
import {Line, Group} from 'react-konva'
import Konva from 'konva'

import {Anchor} from './common'

function getRandomPoints (n, size) {
  const {random, floor} = Math
  const arr = []
  for (let i = 0; i < n * 2; i++) arr.push(floor(random() * size) + 1)
  return arr
}

function getAverage (array, floor = true) {
  let sum = 0
  for (const i of array) sum += i
  let avg = sum / array.length
  return floor ? Math.floor(avg) : avg
}

const diff = (a, b) => a > b ? a - b : b - a
const lth = (a) => a.sort((a, b) => a - b)
const htl = (a) => a.sort((a, b) => b - a)

const findClosestPoints = (points, x, y) => (
  Array(points.length / 2)
    .fill(null)
    .map((v, i) => i)
    .map((v) => v * 2)
    .sort((a, b) => {
      const da = diff(points[a], x) + diff(points[a + 1], y)
      const db = diff(points[b], x) + diff(points[b + 1], y)
      return da - db
    })
)

class PersistentListener {
  constructor (eventName, callback, turnOn = false) {
    this.eventName = eventName
    this.callback = callback
    this.on = this.on.bind(this)
    this.off = this.off.bind(this)
    if (turnOn) this.on()
  }
  on () {
    window.addEventListener(this.eventName, this.callback)
  }
  off () {
    window.removeEventListener(this.eventName, this.callback)
  }
}



export default class FlexPoly extends PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      x: props.x,
      y: props.y,
      points: getRandomPoints(props.corners, props.size),
      fill: props.fill || Konva.Util.getRandomColor()
    }
    this.reposition = this.reposition.bind(this)
    this.resize = this.resize.bind(this)
    this.trackMouse = this.trackMouse.bind(this)
    this.keyListener = new PersistentListener('keypress', (event) => {
      if (event.key === '+') this.addCorner()
      else if (event.key === '-') this.deleteCorner()
    })
  }

  addCorner () {
    const points = this.state.points.slice()
    const [a, b] = findClosestPoints(points, ...this.mousePosition)
    let i
    if (diff(a, b) === 2) i = htl([a, b])[0]
    else i = lth([a, b])[0]
    points.splice(i, 0, ...this.mousePosition)
    this.setState({points})
  }

  deleteCorner () {
    if (this.state.points.length < 7) return
    const points = this.state.points.slice()
    const i = findClosestPoints(points, ...this.mousePosition)[0]
    points.splice(i, 2)
    this.setState({points})
  }

  reposition (event) {
    if (event.target.nodeType !== 'Group') return
    const {x, y} = event.target.attrs
    this.setState({x, y})
  }

  trackMouse (event) {
    const {x, y} = this.state
    const {evt} = event
    this.mousePosition = [evt.layerX - x, evt.layerY - y]
  }

  resize (event) {
    const points = this.state.points.slice()
    const i = +event.target.name()
    const {x, y} = event.target.attrs
    points[i] = x
    points[i + 1] = y
    this.setState({points})
  }

  render () {
    const {x, y, points, fill} = this.state
    const anchors = []
    for (let i = 0; i < points.length; i += 2) {
      anchors.push(
        <Anchor
          x={points[i]} y={points[i + 1]}
          key={i} name={`${i}`}
          onDragMove={this.resize}
        />
      )
    }

    return (
      <Group draggable={true} x={x} y={y} onDragEnd={this.reposition}>
        <Line
          closed={true} points={points} fill={fill} shadowBlur={5}
          onMouseEnter={this.keyListener.on}
          onMouseLeave={this.keyListener.off}
          onMouseMove={this.trackMouse}
        />
        {anchors}
      </Group>
    )
  }
}
