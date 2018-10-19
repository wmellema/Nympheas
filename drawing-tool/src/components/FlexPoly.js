import React, {PureComponent} from 'react'
import {Line, Group} from 'react-konva'
import Konva from 'konva'

import {Anchor} from './common'

const diff = (a, b) => a > b ? a - b : b - a

const findClosestPoints = (points, x, y) =>
  Array(points.length / 2)
    .fill(0)
    .map((v, i) => i)
    .map((v) => v * 2)
    .sort((a, b) => {
      const da = diff(points[a], x) + diff(points[a + 1], y)
      const db = diff(points[b], x) + diff(points[b + 1], y)
      return da - db
    })

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
      points: props.points,
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
    if (diff(a, b) === 2) i = a > b ? a : b
    else i = a < b ? a : b
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

    if (this.props.selected) {
      for (let i = 0; i < points.length; i += 2) {
        anchors.push(
          <Anchor
            x={points[i]} y={points[i + 1]}
            key={i} name={`${i}`}
            onDragMove={this.resize}
          />
        )
      }
    }

    return (
      <Group draggable={true} x={x} y={y} onDragEnd={this.reposition}>
        <Line
          closed={true} points={points} fill={fill} shadowBlur={5}
          name={this.props.name}
          onMouseEnter={this.keyListener.on}
          onMouseLeave={this.keyListener.off}
          onMouseMove={this.trackMouse}
          onMouseDown={this.props.onMouseDown}
        />
        {anchors}
      </Group>
    )
  }
}
